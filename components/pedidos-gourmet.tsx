'use client'

import React, { useState, useEffect } from 'react'
import { Search, Home, Clock, Calendar, Mail, Settings, ChevronDown, Trash2, Plus, Minus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Producto {
  id: number
  nombre: string
  precio: number
  imagen: string
  disponible: number
  descripcion: string
  categoria: string
}

const productosIniciales: Producto[] = [
  { id: 1, nombre: "Filete de Res Premium", precio: 29.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 20, descripcion: "Corte fino de res, madurado 28 días", categoria: "Carnes" },
  { id: 2, nombre: "Costillas de Cordero", precio: 34.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 15, descripcion: "Costillas de cordero de Nueva Zelanda", categoria: "Carnes" },
  { id: 3, nombre: "Salmón Ahumado", precio: 24.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 25, descripcion: "Salmón noruego ahumado en frío", categoria: "Pescados" },
  { id: 4, nombre: "Queso Brie Trufado", precio: 19.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 30, descripcion: "Queso Brie con trozos de trufa negra", categoria: "Quesos" },
  { id: 5, nombre: "Jamón Ibérico de Bellota", precio: 89.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 10, descripcion: "Jamón ibérico de bellota, curado 36 meses", categoria: "Embutidos" },
  { id: 6, nombre: "Foie Gras", precio: 39.99, imagen: "/placeholder.svg?height=120&width=120", disponible: 18, descripcion: "Foie gras de pato con reducción de Oporto", categoria: "Delicatessen" },
]

interface ItemPedido extends Producto {
  cantidad: number
}

interface Pedido {
  id: number
  fecha: Date
  items: ItemPedido[]
  total: number
}

interface Mensaje {
  id: number
  fecha: Date
  contenido: string
  leido: boolean
}

interface Evento {
  id: number
  fecha: Date
  titulo: string
  descripcion: string
}

export function PedidosGourmetComponent() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [productos, setProductos] = useState<Producto[]>(productosIniciales)
  const [itemsPedido, setItemsPedido] = useState<ItemPedido[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [tipoEnvio, setTipoEnvio] = useState('Para Llevar')
  const [vistaActual, setVistaActual] = useState('Productos')
  const [historialPedidos, setHistorialPedidos] = useState<Pedido[]>([])
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [configuracion, setConfiguracion] = useState({
    notificaciones: true,
    idiomaPreferido: 'Español',
    temaOscuro: false,
  })

  useEffect(() => {
    const productosFiltrados = productosIniciales.filter(producto => 
      (categoriaActiva === 'Todos' || producto.categoria === categoriaActiva) &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    setProductos(productosFiltrados)
  }, [categoriaActiva, busqueda])

  const agregarAlPedido = (producto: Producto) => {
    setItemsPedido(prev => {
      const itemExistente = prev.find(item => item.id === producto.id)
      if (itemExistente) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    toast({
      title: "Producto añadido",
      description: `${producto.nombre} ha sido añadido a tu pedido.`,
    })
  }

  const actualizarCantidad = (id: number, delta: number) => {
    setItemsPedido(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, cantidad: Math.max(0, item.cantidad + delta) }
          : item
      ).filter(item => item.cantidad > 0)
    )
  }

  const subtotal = itemsPedido.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  const abrirModalProducto = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setModalProductoAbierto(true)
  }

  const cerrarModalProducto = () => {
    setProductoSeleccionado(null)
    setModalProductoAbierto(false)
  }

  const finalizarPedido = () => {
    const nuevoPedido: Pedido = {
      id: historialPedidos.length + 1,
      fecha: new Date(),
      items: [...itemsPedido],
      total: total
    }
    setHistorialPedidos([nuevoPedido, ...historialPedidos])
    setItemsPedido([])
    toast({
      title: "Pedido realizado",
      description: `Tu pedido #${nuevoPedido.id} por €${total.toFixed(2)} ha sido procesado. Gracias por tu compra!`,
    })
  }

  const agregarMensaje = (contenido: string) => {
    const nuevoMensaje: Mensaje = {
      id: mensajes.length + 1,
      fecha: new Date(),
      contenido,
      leido: false
    }
    setMensajes([nuevoMensaje, ...mensajes])
  }

  const agregarEvento = (titulo: string, descripcion: string, fecha: Date) => {
    const nuevoEvento: Evento = {
      id: eventos.length + 1,
      fecha,
      titulo,
      descripcion
    }
    setEventos([...eventos, nuevoEvento])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barra lateral */}
      <div className="w-20 bg-white p-4 flex flex-col items-center justify-between border-r">
        <div className="space-y-8">
          <div className="p-2 rounded-lg bg-gray-200" />
          <Home className={`cursor-pointer ${vistaActual === 'Productos' ? 'text-gray-800' : 'text-gray-400'}`} onClick={() => setVistaActual('Productos')} />
          <Clock className={`cursor-pointer ${vistaActual === 'Historial' ? 'text-gray-800' : 'text-gray-400'}`} onClick={() => setVistaActual('Historial')} />
          <Calendar className={`cursor-pointer ${vistaActual === 'Calendario' ? 'text-gray-800' : 'text-gray-400'}`} onClick={() => setVistaActual('Calendario')} />
          <Mail className={`cursor-pointer ${vistaActual === 'Mensajes' ? 'text-gray-800' : 'text-gray-400'}`} onClick={() => setVistaActual('Mensajes')} />
          <Settings className={`cursor-pointer ${vistaActual === 'Configuración' ? 'text-gray-800' : 'text-gray-400'}`} onClick={() => setVistaActual('Configuración')} />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Gourmet Delicatessen</h1>
            <p className="text-sm text-gray-500">Martes, 2 de Febrero 2023</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="w-64 pl-10 bg-white" 
              placeholder="Buscar productos gourmet..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {vistaActual === 'Productos' && (
          <>
            <div className="mb-8">
              <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                {['Todos', 'Carnes', 'Pescados', 'Quesos', 'Embutidos', 'Vinos', 'Delicatessen'].map(categoria => (
                  <Button
                    key={categoria}
                    variant={categoriaActiva === categoria ? "default" : "ghost"}
                    onClick={() => setCategoriaActiva(categoria)}
                    className={categoriaActiva === categoria ? "bg-gray-800 text-white" : "text-gray-600"}
                  >
                    {categoria}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Seleccione Productos</h2>
                <Button variant="outline" className="text-gray-600" onClick={() => setTipoEnvio(tipoEnvio === 'Para Llevar' ? 'Envío a Domicilio' : 'Para Llevar')}>
                  {tipoEnvio} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map(producto => (
                <Card key={producto.id} className="overflow-hidden cursor-pointer" onClick={() => abrirModalProducto(producto)}>
                  <CardContent className="p-4">
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold mb-2 text-gray-800">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800 font-semibold">€ {producto.precio.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{producto.disponible} disponibles</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {vistaActual === 'Historial' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Historial de Pedidos</h2>
            {historialPedidos.map(pedido => (
              <Card key={pedido.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Pedido #{pedido.id}</h3>
                    <p className="text-sm text-gray-500">{pedido.fecha.toLocaleDateString()}</p>
                  </div>
                  <ul className="list-disc list-inside mb-2">
                    {pedido.items.map(item => (
                      <li key={item.id} className="text-sm">
                        {item.nombre} x{item.cantidad}
                      </li>
                    ))}
                  </ul>
                  <p className="text-right font-semibold">Total: €{pedido.total.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {vistaActual === 'Calendario' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Calendario de Eventos</h2>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <CalendarComponent
                  mode="single"
                  selected={new Date()}
                  onSelect={(date) => {
                    if (date) {
                      agregarEvento("Nuevo Evento", "Descripción del evento", date)
                    }
                  }}
                  className="rounded-md border"
                />
              </div>
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">Eventos Próximos</h3>
                {eventos.map(evento => (
                  <Card key={evento.id} className="mb-2">
                    <CardContent className="p-2">
                      <p className="font-semibold">{evento.titulo}</p>
                      <p className="text-sm text-gray-500">{evento.fecha.toLocaleString()}</p> 
                      <p className="text-sm">{evento.descripcion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {vistaActual === 'Mensajes' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mensajes</h2>
            <div className="mb-4">
              <Input 
                placeholder="Escribe un nuevo mensaje..." 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    agregarMensaje((e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
            {mensajes.map(mensaje => (
              <Card key={mensaje.id} className={`mb-2 ${mensaje.leido ? 'bg-gray-100' : 'bg-white'}`}>
                <CardContent className="p-2">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{mensaje.fecha.toLocaleString()}</p>
                    {!mensaje.leido && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Nuevo</span>}
                  </div>
                  <p>{mensaje.contenido}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {vistaActual === 'Configuración' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Configuración</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificaciones">Notificaciones</Label>
                  <input
                    type="checkbox"
                    id="notificaciones"
                    checked={configuracion.notificaciones}
                    onChange={(e) => setConfiguracion({...configuracion, notificaciones: e.target.checked})}
                  />
                </div>
                <div>
                  <Label htmlFor="idioma">Idioma Preferido</Label>
                  <select
                    id="idioma"
                    value={configuracion.idiomaPreferido}
                    onChange={(e) => setConfiguracion({...configuracion, idiomaPreferido: e.target.value})}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>Español</option>
                    <option>English</option>
                    <option>Français</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="temaOscuro">Tema Oscuro</Label>
                  <input
                    type="checkbox"
                    id="temaOscuro"
                    checked={configuracion.temaOscuro}
                    onChange={(e) => setConfiguracion({...configuracion, temaOscuro: e.target.checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Resumen del Pedido */}
      <div className="w-96 bg-white p-6 border-l overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Pedido #34562</h2>
        <div className="flex gap-2 mb-6">
          <Button 
            variant={tipoEnvio === 'Para Llevar' ? "default" : "outline"} 
            className={tipoEnvio === 'Para Llevar' ? "bg-gray-800 text-white" : "text-gray-600"}
            onClick={() => setTipoEnvio('Para Llevar')}
          >
            Para Llevar
          </Button>
          <Button 
            variant={tipoEnvio === 'Envío a Domicilio' ? "default" : "outline"} 
            className={tipoEnvio === 'Envío a Domicilio' ? "bg-gray-800 text-white" : "text-gray-600"}
            onClick={() => setTipoEnvio('Envío a Domicilio')}
          >
            Envío a Domicilio
          </Button>
        </div>
        <div className="space-y-4 mb-8">
          {itemsPedido.map(item => (
            <div key={item.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg mr-3 object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                    <p className="text-xs text-gray-500">€ {item.precio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => actualizarCantidad(item.id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => actualizarCantidad(item.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm font-medium ml-4">€ {(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">€ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (21%)</span>
            <span className="font-medium">€ {iva.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>€ {total.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white"
          onClick={finalizarPedido}
        >
          Finalizar Pedido
        </Button>
      </div>

      {/* Modal de Producto */}
      <Dialog open={modalProductoAbierto} onOpenChange={cerrarModalProducto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{productoSeleccionado?.nombre}</DialogTitle>
            <DialogDescription>{productoSeleccionado?.descripcion}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <img src={productoSeleccionado?.imagen} alt={productoSeleccionado?.nombre} className="w-full h-48 object-cover rounded-lg mb-4" />
            <p className="text-lg font-semibold mb-2">€ {productoSeleccionado?.precio.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mb-4">{productoSeleccionado?.disponible} unidades disponibles</p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              if (productoSeleccionado) {
                agregarAlPedido(productoSeleccionado)
                cerrarModalProducto()
              }
            }}>
              Añadir al Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}