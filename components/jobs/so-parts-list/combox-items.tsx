import { useAtom, useAtomValue } from 'jotai';
import { Combobox, TextInput, useCombobox } from '@mantine/core';
import {
  actionFormAtom,
  actionsAtom,
  issueFormAtom,
  issuesAtom,
  partFormAtom,
  partsAtom,
} from '@/stores';

export function itemsSelect(category: string) {
  const combobox = useCombobox();

  let formAtom = issueFormAtom; // Default value
  let itemsAtom = issuesAtom;
  let flabel = 'Issue';
  let pholder = ' select issue';

  if (category === 'action') {
    formAtom = actionFormAtom;
    itemsAtom = actionsAtom;
    flabel = 'Action Needed';
    pholder = 'select action';
  } else if (category === 'part') {
    formAtom = partFormAtom;
    itemsAtom = partsAtom;
    flabel = 'Part Name';
    pholder = 'select part';
  }

  const [value, setValue] = useAtom(formAtom);
  const parts = useAtomValue(itemsAtom);

  const shouldFilterOptions = !parts.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? parts.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
    : parts;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label={flabel}
          placeholder={pholder}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
          {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
