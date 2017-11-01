export default function logger({getState}) { 
  return next => action => {
    if(typeof action === 'object' && action.type) {
      console.log(action.type)
      console.log(getState())
    }
    return next(action);
  }
}