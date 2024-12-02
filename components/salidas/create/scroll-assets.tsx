import React, { useEffect, useState } from 'react';
import { getAsset } from '@/services/asset';
import { Asset } from '@/types/asset';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AssetAssignment {
  asset_id: string;
  usuario_id: string;
}

interface ScrollAssetsProps {
  empresa_id: number | null;
  onChange?: (selectedAssets: string[]) => void;
  value?: string[];
  selectedUsers: UserProfile[];
  onAssignmentChange?: (assignments: AssetAssignment[]) => void;
}

interface AssetSelection {
  id: string;
  assignedUserId: string;
}

const ScrollAssets = ({ empresa_id, onChange, value = [], selectedUsers, onAssignmentChange }: ScrollAssetsProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(value);
  const [assetSelections, setAssetSelections] = useState<AssetSelection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedAssets = await getAsset({ empresa_id });
      setAssets(fetchedAssets);
    };

    if (empresa_id) {
      fetchAssets();
    }
  }, [empresa_id]);

  const filteredAssets = assets.filter(asset => 
    asset.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (assetId: string, checked: boolean) => {
    let newSelectedAssets: string[];
    if (checked) {
      newSelectedAssets = [...selectedAssets, assetId];
      setAssetSelections([...assetSelections, { id: assetId, assignedUserId: '' }]);
    } else {
      newSelectedAssets = selectedAssets.filter(id => id !== assetId);
      setAssetSelections(assetSelections.filter(selection => selection.id !== assetId));
    }
    setSelectedAssets(newSelectedAssets);
    onChange?.(newSelectedAssets);
  };

  const handleUserAssignment = (assetId: string, userId: string) => {
    const newSelections = assetSelections.map(selection =>
      selection.id === assetId ? { ...selection, assignedUserId: userId } : selection
    );
    setAssetSelections(newSelections);
    onAssignmentChange?.(
      newSelections.map(selection => ({
        asset_id: selection.id,
        usuario_id: selection.assignedUserId
      }))
    );
  };

  return (
    <Card className="mt-4 border rounded-md">
      <CardHeader>
        <CardTitle>Lista de Activos</CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar activos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={selectedAssets.includes(asset.id.toString())}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(asset.id.toString(), checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`asset-${asset.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {asset.nombre}
                  </Label>
                </div>
                
                {selectedAssets.includes(asset.id.toString()) && (
                  <Select
                    value={assetSelections.find(s => s.id === asset.id.toString())?.assignedUserId}
                    onValueChange={(value) => handleUserAssignment(asset.id.toString(), value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Asignar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScrollAssets;

