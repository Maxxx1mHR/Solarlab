import axios from 'axios';
import type {AddressSuggestionResponse} from '../types';

export async function getAddressSuggestion(params: {
  query: string;
}): Promise<AddressSuggestionResponse> {
  return (
    await axios.post(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token 0bfa922b76b9cd528bf42724815c490350534ba5',
        },
      },
    )
  ).data;
}
