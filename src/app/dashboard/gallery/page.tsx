'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Trash2, Share2, Loader2, ImageIcon, Video, FolderPlus } from 'lucide-react';
import { createClient } from '../../../../supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  created_at: string;
  collection?: string;
};

export default function GalleryPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  
  const supabase = createClient();

  // Simulate fetching media items
  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from your database
        // const { data, error } = await supabase
        //   .from('media')
        //   .select('*')
        //   .eq('user_id', user?.id)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        
        // For demo purposes, we'll use mock data
        const mockData: MediaItem[] = [
          {
            id: '1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
            prompt: 'Colorful abstract waves',
            created_at: new Date().toISOString(),
            collection: 'Backgrounds'
          },
          {
            id: '2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80',
            prompt: 'Medieval warrior portrait',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            collection: 'Characters'
          },
          {
            id: '3',
            type: 'video',
            url: 'https://example.com/sample-video.mp4',
            prompt: 'Cinematic space journey',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            collection: 'Space'
          },
          {
            id: '4',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
            prompt: 'Galaxy with stars',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            collection: 'Space'
          },
          {
            id: '5',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80',
            prompt: 'Black and white landscape',
            created_at: new Date(Date.now() - 345600000).toISOString()
          },
        ];
        
        setMediaItems(mockData);
        
        // Extract unique collections
        const uniqueCollections = Array.from(
          new Set(mockData.filter(item => item.collection).map(item => item.collection))
        ) as string[];
        
        setCollections(uniqueCollections);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast({
          title: 'Error loading media',
          description: 'Could not load your media items. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchMedia();
    }
  }, [user]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setIsCreatingCollection(true);
    
    try {
      // In a real app, you would create the collection in your database
      // const { error } = await supabase.from('collections').insert({
      //   name: newCollectionName,
      //   user_id: user?.id
      // });
      
      // if (error) throw error;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setCollections(prev => [...prev, newCollectionName]);
      setNewCollectionName('');
      
      toast({
        title: 'Collection created',
        description: `"${newCollectionName}" has been created successfully.`
      });
    } catch (error: any) {
      toast({
        title: 'Error creating collection',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      // In a real app, you would delete from your database
      // const { error } = await supabase
      //   .from('media')
      //   .delete()
      //   .eq('id', id)
      //   .eq('user_id', user?.id);
      
      // if (error) throw error;
      
      // Update local state
      setMediaItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Media deleted',
        description: 'The media item has been deleted successfully.'
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting media',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredMedia = selectedCollection
    ? mediaItems.filter(item => item.collection === selectedCollection)
    : mediaItems;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Toaster />
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Create a new collection to organize your media items.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="collection-name">Collection Name</Label>
                  <Input
                    id="collection-name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="My Collection"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateCollection}
                  disabled={isCreatingCollection || !newCollectionName.trim()}
                >
                  {isCreatingCollection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Collection'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all" onClick={() => setSelectedCollection(null)}>All Media</TabsTrigger>
            <TabsTrigger value="images" onClick={() => setSelectedCollection(null)}>Images</TabsTrigger>
            <TabsTrigger value="videos" onClick={() => setSelectedCollection(null)}>Videos</TabsTrigger>
            {collections.map(collection => (
              <TabsTrigger 
                key={collection} 
                value={collection}
                onClick={() => setSelectedCollection(collection)}
              >
                {collection}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No media items found. Start generating some amazing content!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-square bg-muted">
                      {item.type === 'image' ? (
                        <img 
                          src={item.url} 
                          alt={item.prompt} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                          <video 
                            src={item.url} 
                            controls 
                            className="max-h-full max-w-full"
                          />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => handleDeleteMedia(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          {item.type === 'image' ? (
                            <ImageIcon className="h-4 w-4 text-white" />
                          ) : (
                            <Video className="h-4 w-4 text-white" />
                          )}
                          <span className="text-xs text-white">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm">{item.prompt}</p>
                      {item.collection && (
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                            {item.collection}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="images">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia
                .filter(item => item.type === 'image')
                .map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-square bg-muted">
                      <img 
                        src={item.url} 
                        alt={item.prompt} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => handleDeleteMedia(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-white" />
                          <span className="text-xs text-white">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm">{item.prompt}</p>
                      {item.collection && (
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                            {item.collection}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia
                .filter(item => item.type === 'video')
                .map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-square bg-muted">
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <video 
                          src={item.url} 
                          controls 
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          onClick={() => handleDeleteMedia(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-white" />
                          <span className="text-xs text-white">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm">{item.prompt}</p>
                      {item.collection && (
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                            {item.collection}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {collections.map(collection => (
            <TabsContent key={collection} value={collection}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems
                  .filter(item => item.collection === collection)
                  .map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative aspect-square bg-muted">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.prompt} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <video 
                              src={item.url} 
                              controls 
                              className="max-h-full max-w-full"
                            />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                            onClick={() => handleDeleteMedia(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center gap-2">
                            {item.type === 'image' ? (
                              <ImageIcon className="h-4 w-4 text-white" />
                            ) : (
                              <Video className="h-4 w-4 text-white" />
                            )}
                            <span className="text-xs text-white">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm">{item.prompt}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}