// Libraries
import { useEffect } from 'react';
import Mousetrap from 'mousetrap';

function useHotkeys(keyCombo, onPress) {
  useEffect(() => {
    Mousetrap.bind(keyCombo, onPress);

    return () => Mousetrap.unbind(keyCombo);
  }, [keyCombo, onPress]);
}

export default useHotkeys;
