import React from 'react';
import { UUID } from 'crypto';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
    CalendarIcon, 
    UserIcon, 
    FolderIcon, 
    ClipboardListIcon, 
    TagIcon 
} from 'lucide-react';
import { Campo, CampoAssets, Campologs, CampoUsuarios } from '@/types/models';
import { Badge } from '../ui/badge';

const CampoList: React.FC = () => {
    // Datos de prueba (los mismos que en tu código original)
    const campos: Campo[] = [
        {
            id: 1,
            proyecto_id: 101,
            cliente_id: 201,
            fecha_inicio: new Date('2023-01-01'),
            fecha_final: new Date('2023-12-31'),
            clients: {
                id: 301,
                name: 'Wendys',
                rtn: '123456789',
                created_at: '2022-01-01',
                file: null,
            }
        }
    ];

    const assets: CampoAssets[] = [
        {
            id: 1,
            campo_id: 1,
            asset_id: 401,
            estado: true,
            usuario_id: 'user-uuid-1' as UUID,
        }
    ];

    const usuarios: CampoUsuarios[] = [
        {
            id: 1,
            encargado: 'Lucas Donald',
            campo_id: 1,
            usuario_id: 'user-uuid-2' as UUID,
        }
    ];

    const logs: Campologs[] = [
        {
            id: 1,
            campo_id: 1,
            evento: 'Evento A',
            observaciones: 'Sin Observacion',
            asset_id: 401,
            usuario_id: 'user-uuid-3' as UUID,
        }
    ];

    const sortedCampos = campos.sort((a, b) => a.fecha_inicio.getTime() - b.fecha_inicio.getTime());

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Campos</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sección de Campos */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center text-gray-700">
                        <FolderIcon className="mr-2 text-blue-500" /> Campos
                    </h3>
                    {sortedCampos.map(campo => (
                        <Card key={campo.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Proyecto #{campo.proyecto_id}</span>
                                    <Badge variant="secondary">Activo</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="mr-2 w-4 h-4 text-blue-500" />
                                    <span>Inicio: {campo.fecha_inicio.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="mr-2 w-4 h-4 text-red-500" />
                                    <span>Final: {campo.fecha_final.toLocaleDateString()}</span>
                                </div>
                                {campo.clients && (
                                    <div className="flex items-center text-gray-600">
                                        <UserIcon className="mr-2 w-4 h-4 text-green-500" />
                                        <span>{campo.clients.name} </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sección de Assets */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center text-gray-700">
                        <TagIcon className="mr-2 text-purple-500" /> Assets
                    </h3>
                    {assets.map(asset => (
                        <Card key={asset.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Asset #{asset.asset_id}</span>
                                    <Badge variant={asset.estado ? 'activo' : 'inactivo'}>
                                        {asset.estado ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-gray-600">
                                    <UserIcon className="mr-2 w-4 h-4 text-indigo-500" />
                                    <span>Usuario: {asset.usuario_id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sección de Logs */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center text-gray-700">
                        <ClipboardListIcon className="mr-2 text-orange-500" /> Logs
                    </h3>
                    {logs.map(log => (
                        <Card key={log.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{log.evento}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-gray-600">{log.observaciones}</p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Asset: #{log.asset_id}</span>
                                    <span>Usuario: {log.usuario_id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CampoList;