import {Select} from 'antd';
import {Header as HeaderAnt} from 'antd/es/layout/layout';
import {debounce} from '../utils/debounce';
import {$addressSuggestion, addressSearched, addressSelected} from '../models/weatherPage';
import {useUnit} from 'effector-react';

export const Header = () => {
  const handleSearch = debounce((searchValue: string) => {
    addressSearched(searchValue);
  }, 380);

  const [addressesOption] = useUnit([$addressSuggestion]);

  return (
    <HeaderAnt>
      <Select
        style={{width: '100%'}}
        placeholder='Введите название города'
        showSearch
        onSearch={handleSearch}
        onSelect={(_, option) => {
          addressSelected({
            label: option.value?.toString() ?? '',
            value: {
              lat: option.lat,
              lon: option.lon,
            },
          });
        }}
      >
        {addressesOption?.map(({label, value}) => (
          <Select.Option key={label} value={label} lat={value.lat} lon={value.lon}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </HeaderAnt>
  );
};
