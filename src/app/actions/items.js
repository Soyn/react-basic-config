export const ITEMS_HAS_ERRORED = 'ITEMS_HAS_ERRORED';
export const ITEMS_IS_LOADING = 'ITEMS_IS_LOADING';
export const ITEMS_FETCH_DATA_SUCCESS = 'ITEMS_FETCH_DATA_SUCCESS';

export const itemsHasErrored = bool => ({
  type: 'ITEMS_HAS_ERRORED',
  hasErrorEd: bool,
});

export const itemsIsLoading = bool => ({
  type: 'ITEMS_IS_LOADING',
  isLoading: bool,
});

export const itemsFetchDataSuccess = items => ({
  type: 'ITEMS_FETCH_DATA_SUCCESS',
  items,
});

export const errorAfterFiveSeconds = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(itemsHasErrored(true));
    }, 5000);
  };
}

export const itemsFetchData = (url) => {
  return (dispatch) => {
    dispatch(itemsIsLoading(true));

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(itemsIsLoading(false));

        return response;
      })
      .then(response => response.json())
      .then(items => dispatch(itemsFetchDataSuccess(items)))
      .catch(() => dispatch(itemsHasErrored(true)));
  };
}