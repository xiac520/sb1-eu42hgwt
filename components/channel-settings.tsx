import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ChannelSettingsProps {
  quality: 'auto' | 'high' | 'medium' | 'low'
  onQualityChange: (quality: 'auto' | 'high' | 'medium' | 'low') => void
}

export function ChannelSettings({ quality, onQualityChange }: ChannelSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">画质设置</h4>
        <RadioGroup value={quality} onValueChange={onQualityChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auto" id="auto" />
            <Label htmlFor="auto">自动</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">高清</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">标清</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">流畅</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

