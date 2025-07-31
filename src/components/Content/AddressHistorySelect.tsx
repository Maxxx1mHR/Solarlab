import {Button, Flex, Select} from 'antd';
import {
  $addressHistory,
  addressFromHistorySelected,
  addressHistoryCleared,
  geolocationSearched,
} from '../../models/weatherPage';
import {useUnit} from 'effector-react';
import styles from './styles.module.scss';

export const AddressHistorySelect = () => {
  const [addressHistory] = useUnit([$addressHistory]);

  return (
    <Flex justify='end' gap='small' className={styles.selectWrapper}>
      <Select
        placeholder='История поиска'
        style={{width: 300}}
        onSelect={(_, option) => {
          addressFromHistorySelected({
            label: option.value?.toString() ?? '',
            value: {
              lat: option.lat,
              lon: option.lon,
            },
          });
        }}
        popupRender={(menu) => (
          <>
            {menu}
            <Button
              style={{marginTop: 20}}
              onClick={() => {
                addressHistoryCleared();
              }}
              danger
            >
              Очистить предыдущие значения поиска
            </Button>
          </>
        )}
      >
        {addressHistory?.map(({label, value}, index) => (
          <Select.Option key={index} value={label} lat={value.lat} lon={value.lon}>
            {label}
          </Select.Option>
        ))}
      </Select>
      <Button onClick={() => geolocationSearched()}>Поиск по Вашей геолокации</Button>
    </Flex>
  );
};
