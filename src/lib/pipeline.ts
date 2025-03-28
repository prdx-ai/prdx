/**
 * Pipeline system for chaining tools together
 */

import { Tool, ToolOutput, executeTool } from "./tools";

type PipelineStep = {
  toolName: string;
  inputs: Record<string, any>;
  outputMapping?: Record<string, string>; // Maps output fields to input fields for next step
};

type Pipeline = {
  id: string;
  name: string;
  description: string;
  steps: PipelineStep[];
};

type PipelineResult = {
  success: boolean;
  outputs: ToolOutput[];
  error?: string;
};

/**
 * Execute a pipeline of tools, passing outputs from one tool to inputs of the next
 */
export async function executePipeline(
  pipeline: Pipeline,
  initialInputs: Record<string, any> = {},
): Promise<PipelineResult> {
  try {
    const outputs: ToolOutput[] = [];
    let currentInputs = { ...initialInputs };

    for (let i = 0; i < pipeline.steps.length; i++) {
      const step = pipeline.steps[i];

      // Prepare inputs for this step
      const stepInputs: Record<string, any> = {};

      // Copy inputs defined in the step
      for (const [key, value] of Object.entries(step.inputs)) {
        stepInputs[key] = value;
      }

      // Override with any matching inputs from the current context
      for (const [key, value] of Object.entries(currentInputs)) {
        if (key in step.inputs) {
          stepInputs[key] = value;
        }
      }

      // Execute the tool
      const output = await executeTool(step.toolName, stepInputs);
      outputs.push(output);

      // Map outputs to inputs for the next step
      if (step.outputMapping && i < pipeline.steps.length - 1) {
        for (const [outputField, inputField] of Object.entries(
          step.outputMapping,
        )) {
          if (output.data && outputField in output.data) {
            currentInputs[inputField] = output.data[outputField];
          }
        }
      }
    }

    return {
      success: true,
      outputs,
    };
  } catch (error) {
    console.error("Error executing pipeline:", error);
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Example pipelines
export const imageThenVideoPipeline: Pipeline = {
  id: "image-to-video",
  name: "Image to Video",
  description: "Generate an image and then turn it into a video",
  steps: [
    {
      toolName: "openai-image-gen",
      inputs: {
        prompt: "", // Will be provided at runtime
      },
      outputMapping: {
        url: "imageUrl", // Map the image URL to the video gen input
      },
    },
    {
      toolName: "video-gen",
      inputs: {
        imageUrl: "", // Will be filled from previous step
        prompt: "", // Will be provided at runtime
      },
    },
  ],
};

// Registry of available pipelines
const pipelineRegistry: Record<string, Pipeline> = {
  "image-to-video": imageThenVideoPipeline,
};

/**
 * Get a pipeline by ID
 */
export function getPipeline(id: string): Pipeline | undefined {
  return pipelineRegistry[id];
}

/**
 * Get all registered pipelines
 */
export function getAllPipelines(): Pipeline[] {
  return Object.values(pipelineRegistry);
}
