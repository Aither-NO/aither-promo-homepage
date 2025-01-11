import { useMount } from "@/hooks/useMount";
import { iOS } from "@/utils/client/platform";
import { ColumnSpacingIcon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Flex,
  Select,
  Slider,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import cn from "classnames";
import { ReactNode, useRef } from "react";
import config from "../../next.config.mjs";
import styles from "./SunVisualizerWithControls.module.css";
import { useSunVisForm } from "./context";

export function SunVisualizerWithControls(props: {
  viewExpanded: boolean;
  setViewExpanded?: (expanded: boolean) => void;
  hideTopControls?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}) {
  const form = useSunVisForm();
  const ref = useRef<HTMLVideoElement>(null);
  const { angle, month, time } = form.getValues();

  // Set the initial time
  useMount(() => {
    let times = 0;
    function check() {
      const video = ref.current;
      const isOk = video && video.duration;
      if (!isOk && times < 20) {
        times += 1;
        setTimeout(check, 100);
      }
      if (video && video.duration) {
        const newVal = (video.duration / 24) * (time ?? 12);
        if (!Number.isNaN(newVal)) {
          video.currentTime = newVal;
        }
      }
    }
    check();
  });

  return (
    <Card
      variant="ghost"
      style={{
        maxWidth: "100%",
        flex: 2,
        height: "max-content",
      }}
      size="1"
      ref={props.containerRef}
    >
      <Flex direction={"column"} gap="3">
        <div className={styles.videoContainer}>
          <video
            src={config.basePath + "/vid/fake-demo-2.mp4"}
            ref={ref}
            style={{
              width: "100%",
              borderRadius: "var(--radius-4)",
            }}
            autoPlay={iOS()}
            playsInline
          />
          {!props.hideTopControls && (
            <div
              style={{
                position: "absolute",
                top: -1,
                left: -1,
                right: -1,
              }}
            >
              <Card
                variant="surface"
                size="1"
                className={cn(styles.controls, styles.top)}
              >
                <Flex align="center" gap="2">
                  {/* <AnglePicker
                  ticks={12 / 360}
                  size="2rem"
                  angle={angle ?? 0}
                  onChange={(v) => form.setValue("angle", v)}
                /> */}
                  <MonthSelect
                    value={month}
                    onChange={(v) => form.setValue("month", v)}
                  />
                  {props.setViewExpanded && (
                    <Tooltip
                      content={
                        props.viewExpanded
                          ? "Collapse"
                          : "Expand"
                      }
                    >
                      <Button
                        size="3"
                        style={{ marginInline: "auto" }}
                        variant="ghost"
                        color="gray"
                        onClick={() => {
                          props.setViewExpanded!(
                            !props.viewExpanded
                          );
                        }}
                      >
                        <ColumnSpacingIcon />
                      </Button>
                    </Tooltip>
                  )}
                </Flex>
              </Card>
            </div>
          )}
          <TimeSlider
            style={{
              position: "absolute",
              bottom: 0,
              left: -1,
              right: -1,
            }}
            videoRef={ref}
            value={time}
            onChange={(v) => form.setValue("time", v)}
            className={cn(styles.controls, styles.bottom)}
          />
        </div>
      </Flex>
    </Card>
  );
}

function TimeSlider(props: {
  videoRef: React.RefObject<HTMLVideoElement>;
  style?: React.CSSProperties;
  value: number;
  onChange: (time: number) => void;
  className?: string;
}) {
  return (
    <Card
      variant="surface"
      size="1"
      style={props.style}
      className={props.className}
    >
      <Flex direction="column" gap="2">
        <Slider
          value={[props.value]}
          onValueChange={([newVal]) => {
            props.onChange(newVal);
            const video = props.videoRef.current;
            if (video) {
              const duration = video.duration;
              video.currentTime = (duration / 24) * newVal;
            }
          }}
          defaultValue={[12]}
          step={0.1}
          size="3"
          color="gray"
          max={24}
          min={0}
        />
        <Flex direction="row" justify="between">
          <VideoLabel>00:00</VideoLabel>
          <VideoLabel>06:00</VideoLabel>
          <VideoLabel>12:00</VideoLabel>
          <VideoLabel>18:00</VideoLabel>
          <VideoLabel>24:00</VideoLabel>
        </Flex>
      </Flex>
    </Card>
  );
}

function MonthSelect(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select.Root
      defaultValue={props.value}
      value={props.value}
      onValueChange={props.onChange}
      disabled
    >
      <Select.Trigger style={{ flexGrow: "1" }} />
      <Select.Content>
        <Select.Group>
          <Select.Label>Month</Select.Label>
          <Select.Item value="january">January</Select.Item>
          <Select.Item value="february">February</Select.Item>
          <Select.Item value="march">March</Select.Item>
          <Select.Item value="april">April</Select.Item>
          <Select.Item value="may">May</Select.Item>
          <Select.Item value="june">June</Select.Item>
          <Select.Item value="july">July</Select.Item>
          <Select.Item value="august">August</Select.Item>
          <Select.Item value="september">September</Select.Item>
          <Select.Item value="october">October</Select.Item>
          <Select.Item value="november">November</Select.Item>
          <Select.Item value="december">December</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

function VideoLabel(props: { children: ReactNode }) {
  return (
    <Text
      size="1"
      color="gray"
      style={{ userSelect: "none", pointerEvents: "none" }}
      weight="bold"
    >
      {props.children}
    </Text>
  );
}
