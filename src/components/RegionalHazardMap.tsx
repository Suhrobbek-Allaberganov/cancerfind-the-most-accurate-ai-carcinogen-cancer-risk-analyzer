import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Droplets, Wind, Sprout, AlertTriangle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getRegionalHazards, HazardMapData } from '@/services/geolocation'

export default function RegionalHazardMap() {
  const { t } = useTranslation();
  const [data, setData] = useState<HazardMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHazards = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRegionalHazards();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to detect location or load hazards.");
    } finally {
      setLoading(false);
    }
  };

  const getMediumIcon = (medium: string) => {
    switch (medium) {
      case 'Water': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Air': return <Wind className="w-4 h-4 text-gray-500" />;
      case 'Soil': return <Sprout className="w-4 h-4 text-green-600" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'High': return <Badge variant="destructive">High</Badge>;
      case 'Moderate': return <Badge className="bg-orange-500 text-white">Moderate</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="text-primary" />
          {t('map.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('map.description')}</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {!data && !loading && (
          <Button onClick={loadHazards} className="w-full gap-2">
            <MapPin className="w-4 h-4" />
            {t('map.detect')}
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground italic">Detecting regional environmental data...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-lg">{data.region}</span>
              <Badge variant="outline" className="text-xs">Active Monitoring</Badge>
            </div>
            
            <div className="grid gap-3">
              {data.pollutants.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      {getMediumIcon(p.medium)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.substance}</p>
                      <p className="text-xs text-muted-foreground">{p.source}</p>
                    </div>
                  </div>
                  {getLevelBadge(p.level)}
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border italic text-xs leading-relaxed text-muted-foreground">
              {data.assessment}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
