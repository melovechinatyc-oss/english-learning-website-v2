"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLearning } from "@/contexts/learning-context";

export function ListenSettingsPanel() {
  const { settings, updateSettings } = useLearning();

  return (
    <Collapsible className="rounded-xl border bg-card p-4">
      <CollapsibleTrigger
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        播放设置
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span>播放中文</span>
          <Switch
            checked={settings.playChinese}
            onCheckedChange={(checked) => updateSettings({ playChinese: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>播放发音提示</span>
          <Switch
            checked={settings.playPronunciation}
            onCheckedChange={(checked) =>
              updateSettings({ playPronunciation: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <span>只播放英文</span>
          <Switch
            checked={settings.englishOnly}
            onCheckedChange={(checked) => updateSettings({ englishOnly: checked })}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm">语音偏好（尽量匹配）</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "auto", label: "自动" },
              { value: "male", label: "偏男声" },
              { value: "female", label: "偏女声" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={buttonVariants({
                  variant:
                    option.value === settings.ttsVoicePreference
                      ? "default"
                      : "outline",
                  size: "sm",
                })}
                onClick={() =>
                  updateSettings({
                    ttsVoicePreference: option.value as
                      | "auto"
                      | "male"
                      | "female",
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm">重复次数</p>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5"].map((v) => (
              <button
                key={v}
                type="button"
                className={buttonVariants({
                  variant: Number(v) === settings.repeatCount ? "default" : "outline",
                  size: "sm",
                })}
                onClick={() =>
                  updateSettings({ repeatCount: Number(v) as 1 | 2 | 3 | 4 | 5 })
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm">播放速度</p>
          <div className="flex flex-wrap gap-2">
            {["0.75", "1", "1.25"].map((v) => (
              <button
                key={v}
                type="button"
                className={buttonVariants({
                  variant: Number(v) === settings.speed ? "default" : "outline",
                  size: "sm",
                })}
                onClick={() => updateSettings({ speed: Number(v) as 0.75 | 1 | 1.25 })}
              >
                {v}x
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm">句间停顿</p>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3"].map((v) => (
              <button
                key={v}
                type="button"
                className={buttonVariants({
                  variant: Number(v) === settings.pauseSeconds ? "default" : "outline",
                  size: "sm",
                })}
                onClick={() => updateSettings({ pauseSeconds: Number(v) as 1 | 2 | 3 })}
              >
                {v} 秒
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>循环整课</span>
          <Switch
            checked={settings.loopCourse}
            onCheckedChange={(checked) => updateSettings({ loopCourse: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>自动下一句</span>
          <Switch
            checked={settings.autoNext}
            onCheckedChange={(checked) => updateSettings({ autoNext: checked })}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
