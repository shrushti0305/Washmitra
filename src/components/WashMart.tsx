import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Package, Info, Tag } from 'lucide-react';

export default function WashMart() {
  const { washMartItems } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 text-white p-8 rounded-[2rem]">
        <div>
          <h2 className="text-3xl font-black mb-2">WashMART</h2>
          <p className="text-slate-400 max-w-md">Exclusive discounted materials and tools for certified WashMitras. Pay via platform tokens or cash.</p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-slate-500 font-bold uppercase">Balance</span>
              <span className="text-xl font-black text-orange-500">₹4500</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {washMartItems.map((item) => (
          <Card key={item.id} className="overflow-hidden border-slate-100 group">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                WashMitra Price
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900">₹{item.discount_price || item.price}</span>
                {item.discount_price && (
                  <span className="text-sm text-slate-400 line-through">₹{item.price}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
               <Button className="w-full bg-slate-900 hover:bg-slate-800 gap-2 font-bold">
                 <ShoppingCart className="h-4 w-4" /> Add to Kit
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
