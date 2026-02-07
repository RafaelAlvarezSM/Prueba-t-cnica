// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Search, 
//   Filter,
//   Upload,
//   X,
//   Package,
//   Tag
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// // Mock data para productos
// const mockProducts = [
//   {
//     id: 1,
//     name: 'Nike Air Max 90',
//     description: 'Zapatillas clásicas con tecnología Air',
//     category: 'Hombre',
//     brand: 'Nike',
//     stock: 18,
//     status: 'active',
//     image: '/api/placeholder/60/60'
//   },
//   {
//     id: 2,
//     name: 'Adidas Ultraboost 22',
//     description: 'Running con máxima amortiguación',
//     category: 'Hombre',
//     brand: 'Adidas',
//     stock: 8,
//     status: 'active',
//     image: '/api/placeholder/60/60'
//   },
//   {
//     id: 3,
//     name: 'Puma RS-X',
//     description: 'Estilo retro con tecnología moderna',
//     category: 'Mujer',
//     brand: 'Puma',
//     stock: 25,
//     status: 'active',
//     image: '/api/placeholder/60/60'
//   },
//   {
//     id: 4,
//     name: 'New Balance 574',
//     description: 'Clásico del running casual',
//     category: 'Niño',
//     brand: 'New Balance',
//     stock: 3,
//     status: 'active',
//     image: '/api/placeholder/60/60'
//   },
//   {
//     id: 5,
//     name: 'Vans Old Skool',
//     description: 'Zapatillas icónicas del skate',
//     category: 'Mujer',
//     brand: 'Vans',
//     stock: 15,
//     status: 'active',
//     image: '/api/placeholder/60/60'
//   }
// ];

// interface ProductOption {
//   id: string;
//   name: string;
//   values: string[];
// }

// export default function ProductsPage() {
//   const { isAdmin } = useAuth();
//   const [products, setProducts] = useState(mockProducts);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     gender: '',
//     brand: ''
//   });
//   const [productOptions, setProductOptions] = useState<ProductOption[]>([
//     { id: '1', name: 'Color', values: ['Negro', 'Blanco'] },
//     { id: '2', name: 'Talla', values: ['40', '41', '42'] }
//   ]);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingProduct) {
//       setProducts(prev => prev.map(product => 
//         product.id === editingProduct.id 
//           ? { ...product, ...formData }
//           : product
//       ));
//     } else {
//       const newProduct = {
//         id: Math.max(...products.map(p => p.id)) + 1,
//         ...formData,
//         stock: 0,
//         status: 'active',
//         image: '/api/placeholder/60/60'
//       };
//       setProducts(prev => [...prev, newProduct]);
//     }

//     setFormData({ name: '', description: '', gender: '', brand: '' });
//     setProductOptions([
//       { id: '1', name: 'Color', values: ['Negro', 'Blanco'] },
//       { id: '2', name: 'Talla', values: ['40', '41', '42'] }
//     ]);
//     setEditingProduct(null);
//     setIsModalOpen(false);
//   };

//   const handleEdit = (product: any) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       description: product.description,
//       gender: product.category,
//       brand: product.brand
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = (productId: number) => {
//     setProducts(prev => prev.filter(product => product.id !== productId));
//   };

//   const getStockBadge = (stock: number) => {
//     if (stock >= 15) {
//       return (
//         <Badge variant="default" className="bg-green-100 text-green-800">
//           {stock} unidades
//         </Badge>
//       );
//     } else if (stock >= 5) {
//       return (
//         <Badge variant="default" className="bg-yellow-100 text-yellow-800">
//           {stock} unidades
//         </Badge>
//       );
//     } else {
//       return (
//         <Badge variant="default" className="bg-red-100 text-red-800">
//           {stock} unidades
//         </Badge>
//       );
//     }
//   };

//   const getCategoryBadge = (category: string) => {
//     const colors = {
//       'Hombre': 'bg-blue-100 text-blue-800',
//       'Mujer': 'bg-purple-100 text-purple-800',
//       'Niño': 'bg-green-100 text-green-800'
//     };
    
//     return (
//       <Badge variant="outline" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
//         {category}
//       </Badge>
//     );
//   };

//   const addProductOption = () => {
//     const newOption: ProductOption = {
//       id: Date.now().toString(),
//       name: '',
//       values: []
//     };
//     setProductOptions(prev => [...prev, newOption]);
//   };

//   const updateProductOption = (id: string, field: 'name' | 'values', value: string | string[]) => {
//     setProductOptions(prev => prev.map(option => 
//       option.id === id 
//         ? { ...option, [field]: value }
//         : option
//     ));
//   };

//   const addOptionValue = (optionId: string) => {
//     const option = productOptions.find(opt => opt.id === optionId);
//     if (option) {
//       updateProductOption(optionId, 'values', [...option.values, '']);
//     }
//   };

//   const updateOptionValue = (optionId: string, valueIndex: number, newValue: string) => {
//     const option = productOptions.find(opt => opt.id === optionId);
//     if (option) {
//       const newValues = [...option.values];
//       newValues[valueIndex] = newValue;
//       updateProductOption(optionId, 'values', newValues);
//     }
//   };

//   const removeOptionValue = (optionId: string, valueIndex: number) => {
//     const option = productOptions.find(opt => opt.id === optionId);
//     if (option) {
//       const newValues = option.values.filter((_, index) => index !== valueIndex);
//       updateProductOption(optionId, 'values', newValues);
//     }
//   };

//   const removeProductOption = (optionId: string) => {
//     setProductOptions(prev => prev.filter(option => option.id !== optionId));
//   };

//   if (!isAdmin) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600">Acceso Restringido</h2>
//           <p className="text-muted-foreground mt-2">Esta página está disponible solo para administradores.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="container mx-auto p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
//           <div className="flex gap-3">
//             <Button variant="outline">
//               <Upload className="mr-2 h-4 w-4" />
//               Importar Productos
//             </Button>
//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-slate-900 hover:bg-slate-800 text-white">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Nuevo Producto
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
//                   </DialogTitle>
//                   <DialogDescription>
//                     {editingProduct 
//                       ? 'Modifica los datos del producto existente.'
//                       : 'Agrega un nuevo producto al catálogo.'
//                     }
//                   </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit}>
//                   <div className="grid gap-6 py-4">
//                     {/* Información Básica */}
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold">Información Básica</h3>
//                       <div className="grid gap-2">
//                         <Label htmlFor="name">Nombre del Producto</Label>
//                         <Input
//                           id="name"
//                           value={formData.name}
//                           onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                           placeholder="Ej: Nike Air Max 90"
//                           required
//                         />
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="description">Descripción</Label>
//                         <Textarea
//                           id="description"
//                           value={formData.description}
//                           onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                           placeholder="Describe las características del producto..."
//                           rows={3}
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="grid gap-2">
//                           <Label htmlFor="gender">Género</Label>
//                           <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Seleccionar género" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Hombre">Hombre</SelectItem>
//                               <SelectItem value="Mujer">Mujer</SelectItem>
//                               <SelectItem value="Niño">Niño</SelectItem>
//                               <SelectItem value="Unisex">Unisex</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="grid gap-2">
//                           <Label htmlFor="brand">Marca</Label>
//                           <Input
//                             id="brand"
//                             value={formData.brand}
//                             onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
//                             placeholder="Ej: Nike"
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="grid gap-2">
//                         <Label>Imágenes del Producto</Label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                           <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                           <p className="text-sm text-gray-600">Arrastra imágenes aquí o haz clic para subir</p>
//                           <Button type="button" variant="outline" className="mt-2">
//                             Seleccionar Archivos
//                           </Button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Opciones del Producto */}
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center">
//                         <h3 className="text-lg font-semibold">Opciones del Producto</h3>
//                         <Button type="button" variant="outline" onClick={addProductOption}>
//                           <Plus className="mr-2 h-4 w-4" />
//                           Agregar Opción
//                         </Button>
//                       </div>
                      
//                       {productOptions.map((option, optionIndex) => (
//                         <Card key={option.id} className="p-4">
//                           <div className="space-y-3">
//                             <div className="flex justify-between items-center">
//                               <Input
//                                 placeholder="Nombre de la opción (ej: Color, Talla)"
//                                 value={option.name}
//                                 onChange={(e) => updateProductOption(option.id, 'name', e.target.value)}
//                                 className="font-medium"
//                               />
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeProductOption(option.id)}
//                                 className="text-red-600"
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>
                            
//                             <div className="space-y-2">
//                               <Label>Valores disponibles</Label>
//                               {option.values.map((value, valueIndex) => (
//                                 <div key={valueIndex} className="flex gap-2">
//                                   <Input
//                                     placeholder={`Valor ${valueIndex + 1}`}
//                                     value={value}
//                                     onChange={(e) => updateOptionValue(option.id, valueIndex, e.target.value)}
//                                   />
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeOptionValue(option.id, valueIndex)}
//                                     className="text-red-600"
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ))}
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => addOptionValue(option.id)}
//                               >
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Agregar Valor
//                               </Button>
//                             </div>
//                           </div>
//                         </Card>
//                       ))}
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
//                       Cancelar
//                     </Button>
//                     <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
//                       {editingProduct ? 'Guardar Cambios' : 'Crear Producto con Variantes'}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Barra de Herramientas */}
//         <Card className="bg-white rounded-lg shadow-sm mb-6">
//           <CardContent className="p-4">
//             <div className="flex justify-between items-center">
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Buscar productos por nombre..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <div className="flex gap-2 ml-4">
//                 <Button variant="outline">
//                   <Filter className="mr-2 h-4 w-4" />
//                   Filtros
//                 </Button>
//                 <Button variant="outline">
//                   Limpiar
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Tabla de Productos */}
//         <Card className="bg-white rounded-lg shadow-sm">
//           <CardContent className="p-0">
//             {loading ? (
//               <div className="space-y-3 p-6">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="flex items-center space-x-4 p-4 border-b">
//                     <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                       <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
//                     </div>
//                     <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="flex space-x-2">
//                       <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
//                       <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-[80px]">Miniatura</TableHead>
//                     <TableHead>Nombre</TableHead>
//                     <TableHead>Categoría</TableHead>
//                     <TableHead>Marca</TableHead>
//                     <TableHead>Stock Total</TableHead>
//                     <TableHead>Estado</TableHead>
//                     <TableHead className="text-right">Acciones</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredProducts.map((product) => (
//                     <TableRow key={product.id}>
//                       <TableCell>
//                         <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                           <Package className="h-6 w-6 text-gray-500" />
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{product.name}</p>
//                           <p className="text-sm text-gray-500">{product.description}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {getCategoryBadge(product.category)}
//                       </TableCell>
//                       <TableCell className="font-medium">{product.brand}</TableCell>
//                       <TableCell>
//                         {getStockBadge(product.stock)}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="default" className="bg-green-100 text-green-800">
//                           Activo
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleEdit(product)}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleDelete(product.id)}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
