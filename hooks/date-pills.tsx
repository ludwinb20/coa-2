import { useState } from "react";

export const useDatePills = ({
  options,
  defaultSelected,
}: {
  options: { [key: string]: () => { start: string; end: string } };
  defaultSelected: string;
}) => {
  const [selected, setSelected] = useState(defaultSelected);
  const [dates, setDates] = useState<{
    start: string;
    end: string;
  }>(() => {
    return options[selected]();
  });

  const onChangeSelected = (name: string) => {
    setSelected(name);
    setDates(options[name]());
  };

  return {
    selected,
    dates,
    onChangeSelected,
  };
};

export const useMasivosPills = ({
  defaultSelected,
}: {
  defaultSelected: string;
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  const onChangeSelected = (name: string) => {
    setSelected(name);
  };

  return {
    selected,
    onChangeSelected,
  };
};

export function useDatePillsWithPresets({
  defaultSelected,
  options,
}: {
  options: { [key: string]: () => { value: string } };
  defaultSelected: string;
}) {
  const [selected, setSelected] = useState(defaultSelected);
  const [preset, setPreset] = useState<{
    value: string
  }>(() => {
    return options[selected]();
  });

  const onChangeSelected = (name: string) => {
    setSelected(name);
    setPreset(options[name]());
  };

  return {
    selected,
    preset,
    onChangeSelected,
  };
}
