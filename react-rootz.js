import { appState } from 'rootz';

let componentStateHandler;

const setImmutableObject = function (state, obj) {
    return Object.assign({}, state, obj);
}

/*
* this function has been extracted from ReactJS, <component.prototype.setState> function.
*/
const getEnqueueStateHandler = function(scope) {   
  const enqueueStateHandler = function(partialState, callback) {
    this.updater.enqueueSetState(
      this, 
      partialState, 
      callback,
      "setState"
    );
  }.bind(scope);
  return enqueueStateHandler;
}

const setStateHandler = function(branch, scope, state) {
  	branch = `$${branch}`;
  	scope.state = { __rootzStateHandlerVariable: 0 };
	componentStateHandler = setImmutableObject(componentStateHandler, {
      [branch] : {
        state: scope.state,
        stateHandler: getEnqueueStateHandler(scope)
      }
    });
  	appState.set(branch, state);
}
                                               
const executeHandler = function(branch) {
  	const requestedBranch = componentStateHandler[branch];
  	const rootzStateHandlerVariable = requestedBranch.state.__rootzStateHandlerVariable;
	requestedBranch.stateHandler({ __rootzStateHandlerVariable : rootzStateHandlerVariable + 1 });
}

/*
* Intrinsic Functions - End
*/
const subscribe = function ({name, scope, state}) {
	setStateHandler(name, scope, state);
}

const publish = function (name) {
	executeHandler(name);
}

export {subscribe, publish};
