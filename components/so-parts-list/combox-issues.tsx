import { useAtom, useAtomValue } from 'jotai';
import { Combobox, TextInput, useCombobox } from '@mantine/core';
import { issueFormAtom, issuesAtom } from '@/stores';

export function IssueSelect() {
  const combobox = useCombobox();
  const [value, setValue] = useAtom(issueFormAtom);
  const parts = useAtomValue(issuesAtom);

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
          label="Issue"
          placeholder="select issue"
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
