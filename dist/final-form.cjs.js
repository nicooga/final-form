'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'))
var _objectWithoutPropertiesLoose = _interopDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

//
var toPath = function toPath(key) {
  if (key === null || key === undefined || !key.length) {
    return []
  }

  if (typeof key !== 'string') {
    throw new Error('toPath() expects a string')
  }

  return key.split(/[.[\]]+/).filter(Boolean)
}

//

var getIn = function getIn(state, complexKey) {
  // Intentionally using iteration rather than recursion
  var path = toPath(complexKey)
  var current = state

  for (var i = 0; i < path.length; i++) {
    var key = path[i]

    if (
      current === undefined ||
      current === null ||
      typeof current !== 'object' ||
      (Array.isArray(current) && isNaN(key))
    ) {
      return undefined
    }

    current = current[key]
  }

  return current
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, 'string')
  return typeof key === 'symbol' ? key : String(key)
}

function _toPrimitive(input, hint) {
  if (typeof input !== 'object' || input === null) return input
  var prim = input[Symbol.toPrimitive]
  if (prim !== undefined) {
    var res = prim.call(input, hint || 'default')
    if (typeof res !== 'object') return res
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return (hint === 'string' ? String : Number)(input)
}

var setInRecursor = function setInRecursor(current, index, path, value) {
  if (index >= path.length) {
    // end of recursion
    return value
  }

  var key = path[index] // determine type of key

  if (isNaN(key)) {
    var _extends2

    // object set
    if (current === undefined || current === null) {
      var _ref

      // recurse
      var _result2 = setInRecursor(undefined, index + 1, path, value) // delete or create an object

      return _result2 === undefined
        ? undefined
        : ((_ref = {}), (_ref[key] = _result2), _ref)
    }

    if (Array.isArray(current)) {
      throw new Error('Cannot set a non-numeric property on an array')
    } // current exists, so make a copy of all its values, and add/update the new one

    var _result = setInRecursor(current[key], index + 1, path, value)

    var numKeys = Object.keys(current).length

    if (_result === undefined) {
      if (current[key] === undefined && numKeys === 0) {
        // object was already empty
        return undefined
      }

      if (current[key] !== undefined && numKeys <= 1) {
        // only key we had was the one we are deleting
        if (!isNaN(path[index - 1])) {
          // we are in an array, so return an empty object
          return {}
        } else {
          return undefined
        }
      }

      var _removed = current[key],
        final = _objectWithoutPropertiesLoose(
          current,
          [key].map(_toPropertyKey)
        )

      return final
    } // set result in key

    return _extends(
      {},
      current,
      ((_extends2 = {}), (_extends2[key] = _result), _extends2)
    )
  } // array set

  var numericKey = Number(key)

  if (current === undefined || current === null) {
    // recurse
    var _result3 = setInRecursor(undefined, index + 1, path, value) // if nothing returned, delete it

    if (_result3 === undefined) {
      return undefined
    } // create an array

    var _array = []
    _array[numericKey] = _result3
    return _array
  }

  if (!Array.isArray(current)) {
    throw new Error('Cannot set a numeric property on an object')
  } // recurse

  var existingValue = current[numericKey]
  var result = setInRecursor(existingValue, index + 1, path, value) // current exists, so make a copy of all its values, and add/update the new one

  var array = [].concat(current)
  array[numericKey] = result
  return array
}

var setIn = function setIn(state, key, value) {
  if (state === undefined || state === null) {
    throw new Error('Cannot call setIn() with ' + String(state) + ' state')
  }

  if (key === undefined || key === null) {
    throw new Error('Cannot call setIn() with ' + String(key) + ' key')
  } // Recursive function needs to accept and return State, but public API should
  // only deal with Objects

  return setInRecursor(state, 0, toPath(key), value)
}

var FORM_ERROR = 'FINAL_FORM/form-error'
var ARRAY_ERROR = 'FINAL_FORM/array-error'

//
/**
 * Converts internal field state to published field state
 */

var publishFieldState = function publishFieldState(formState, field) {
  var errors = formState.errors,
    initialValues = formState.initialValues,
    lastSubmittedValues = formState.lastSubmittedValues,
    submitErrors = formState.submitErrors,
    submitFailed = formState.submitFailed,
    submitSucceeded = formState.submitSucceeded,
    submitting = formState.submitting,
    values = formState.values
  var active = field.active,
    blur = field.blur,
    change = field.change,
    data = field.data,
    focus = field.focus,
    name = field.name,
    touched = field.touched,
    visited = field.visited
  var value = getIn(values, name)
  var error = getIn(errors, name)

  if (error && error[ARRAY_ERROR]) {
    error = error[ARRAY_ERROR]
  }

  var submitError = submitErrors && getIn(submitErrors, name)
  var initial = initialValues && getIn(initialValues, name)
  var pristine = field.isEqual(initial, value)
  var dirtySinceLastSubmit = !!(
    lastSubmittedValues &&
    !field.isEqual(getIn(lastSubmittedValues, name), value)
  )
  var valid = !error && !submitError
  return {
    active: active,
    blur: blur,
    change: change,
    data: data,
    dirty: !pristine,
    dirtySinceLastSubmit: dirtySinceLastSubmit,
    error: error,
    focus: focus,
    initial: initial,
    invalid: !valid,
    length: Array.isArray(value) ? value.length : undefined,
    name: name,
    pristine: pristine,
    submitError: submitError,
    submitFailed: submitFailed,
    submitSucceeded: submitSucceeded,
    submitting: submitting,
    touched: touched,
    valid: valid,
    value: value,
    visited: visited
  }
}

//
var fieldSubscriptionItems = [
  'active',
  'data',
  'dirty',
  'dirtySinceLastSubmit',
  'error',
  'initial',
  'invalid',
  'length',
  'pristine',
  'submitError',
  'submitFailed',
  'submitSucceeded',
  'submitting',
  'touched',
  'valid',
  'value',
  'visited'
]

//
var shallowEqual = function shallowEqual(a, b) {
  if (a === b) {
    return true
  }

  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false
  }

  var keysA = Object.keys(a)
  var keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b)

  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx]

    if (!bHasOwnProperty(key) || a[key] !== b[key]) {
      return false
    }
  }

  return true
}

//
function subscriptionFilter(
  dest,
  src,
  previous,
  subscription,
  keys,
  shallowEqualKeys
) {
  var different = false
  keys.forEach(function(key) {
    if (subscription[key]) {
      dest[key] = src[key]

      if (
        !previous ||
        (~shallowEqualKeys.indexOf(key)
          ? !shallowEqual(src[key], previous[key])
          : src[key] !== previous[key])
      ) {
        different = true
      }
    }
  })
  return different
}

//
var shallowEqualKeys = ['data']
/**
 * Filters items in a FieldState based on a FieldSubscription
 */

var filterFieldState = function filterFieldState(
  state,
  previousState,
  subscription,
  force
) {
  var result = {
    blur: state.blur,
    change: state.change,
    focus: state.focus,
    name: state.name
  }
  var different =
    subscriptionFilter(
      result,
      state,
      previousState,
      subscription,
      fieldSubscriptionItems,
      shallowEqualKeys
    ) || !previousState
  return different || force ? result : undefined
}

//
var formSubscriptionItems = [
  'active',
  'dirty',
  'dirtyFields',
  'dirtySinceLastSubmit',
  'error',
  'errors',
  'hasSubmitErrors',
  'hasValidationErrors',
  'initialValues',
  'invalid',
  'pristine',
  'submitting',
  'submitError',
  'submitErrors',
  'submitFailed',
  'submitSucceeded',
  'touched',
  'valid',
  'validating',
  'values',
  'visited'
]

//
var shallowEqualKeys$1 = ['touched', 'visited']
/**
 * Filters items in a FormState based on a FormSubscription
 */

var filterFormState = function filterFormState(
  state,
  previousState,
  subscription,
  force
) {
  var result = {}
  var different =
    subscriptionFilter(
      result,
      state,
      previousState,
      subscription,
      formSubscriptionItems,
      shallowEqualKeys$1
    ) || !previousState
  return different || force ? result : undefined
}

//

var memoize = function memoize(fn) {
  var lastArgs
  var lastResult
  return function() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    if (
      !lastArgs ||
      args.length !== lastArgs.length ||
      args.some(function(arg, index) {
        return !shallowEqual(lastArgs[index], arg)
      })
    ) {
      lastArgs = args
      lastResult = fn.apply(void 0, args)
    }

    return lastResult
  }
}

var isPromise = function(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

var configOptions = [
  'debug',
  'initialValues',
  'keepDirtyOnReinitialize',
  'mutators',
  'onSubmit',
  'validate',
  'validateOnBlur'
]
var version = '4.8.1'

var tripleEquals = function tripleEquals(a, b) {
  return a === b
}

var hasAnyError = function hasAnyError(errors) {
  return Object.keys(errors).some(function(key) {
    var value = errors[key]

    if (value && typeof value === 'object') {
      return hasAnyError(value)
    }

    return typeof value !== 'undefined'
  })
}

var convertToExternalFormState = function convertToExternalFormState(_ref) {
  var active = _ref.active,
    dirtySinceLastSubmit = _ref.dirtySinceLastSubmit,
    error = _ref.error,
    errors = _ref.errors,
    initialValues = _ref.initialValues,
    pristine = _ref.pristine,
    submitting = _ref.submitting,
    submitFailed = _ref.submitFailed,
    submitSucceeded = _ref.submitSucceeded,
    submitError = _ref.submitError,
    submitErrors = _ref.submitErrors,
    valid = _ref.valid,
    validating = _ref.validating,
    values = _ref.values
  return {
    active: active,
    dirty: !pristine,
    dirtySinceLastSubmit: dirtySinceLastSubmit,
    error: error,
    errors: errors,
    hasSubmitErrors: !!(
      submitError ||
      (submitErrors && hasAnyError(submitErrors))
    ),
    hasValidationErrors: !!(error || hasAnyError(errors)),
    invalid: !valid,
    initialValues: initialValues,
    pristine: pristine,
    submitting: submitting,
    submitFailed: submitFailed,
    submitSucceeded: submitSucceeded,
    submitError: submitError,
    submitErrors: submitErrors,
    valid: valid,
    validating: validating > 0,
    values: values
  }
}

function notifySubscriber(
  subscriber,
  subscription,
  state,
  lastState,
  filter,
  force
) {
  if (force === void 0) {
    force = false
  }

  var notification = filter(state, lastState, subscription, force)

  if (notification) {
    subscriber(notification)
  }
}

function notify(_ref2, state, lastState, filter) {
  var entries = _ref2.entries
  Object.keys(entries).forEach(function(key) {
    var _entries$Number = entries[Number(key)],
      subscription = _entries$Number.subscription,
      subscriber = _entries$Number.subscriber
    notifySubscriber(subscriber, subscription, state, lastState, filter)
  })
}

var createForm = function createForm(config) {
  if (!config) {
    throw new Error('No config specified')
  }

  var debug = config.debug,
    destroyOnUnregister = config.destroyOnUnregister,
    keepDirtyOnReinitialize = config.keepDirtyOnReinitialize,
    initialValues = config.initialValues,
    mutators = config.mutators,
    onSubmit = config.onSubmit,
    validate = config.validate,
    validateOnBlur = config.validateOnBlur

  if (!onSubmit) {
    throw new Error('No onSubmit function specified')
  }

  var state = {
    subscribers: {
      index: 0,
      entries: {}
    },
    fieldSubscribers: {},
    fields: {},
    formState: {
      dirtySinceLastSubmit: false,
      errors: {},
      initialValues: initialValues && _extends({}, initialValues),
      invalid: false,
      pristine: true,
      submitting: false,
      submitFailed: false,
      submitSucceeded: false,
      valid: true,
      validating: 0,
      values: initialValues ? _extends({}, initialValues) : {}
    },
    lastFormState: undefined
  }
  var inBatch = false
  var validationPaused = false
  var validationBlocked = false
  var nextAsyncValidationKey = 0
  var asyncValidationPromises = {}

  var clearAsyncValidationPromise = function clearAsyncValidationPromise(key) {
    return function(result) {
      delete asyncValidationPromises[key]
      return result
    }
  }

  var changeValue = function changeValue(state, name, mutate) {
    var before = getIn(state.formState.values, name)
    var after = mutate(before)
    state.formState.values = setIn(state.formState.values, name, after) || {}
  }

  var renameField = function renameField(state, from, to) {
    if (state.fields[from]) {
      var _extends2, _extends3

      state.fields = _extends(
        {},
        state.fields,
        ((_extends2 = {}),
        (_extends2[to] = _extends({}, state.fields[from], {
          name: to,
          lastFieldState: undefined
        })),
        _extends2)
      )
      delete state.fields[from]
      state.fieldSubscribers = _extends(
        {},
        state.fieldSubscribers,
        ((_extends3 = {}),
        (_extends3[to] = state.fieldSubscribers[from]),
        _extends3)
      )
      delete state.fieldSubscribers[from]
      var value = getIn(state.formState.values, from)
      state.formState.values =
        setIn(state.formState.values, from, undefined) || {}
      state.formState.values = setIn(state.formState.values, to, value)
      delete state.lastFormState
    }
  } // bind state to mutators

  var getMutatorApi = function getMutatorApi(key) {
    return function() {
      // istanbul ignore next
      if (mutators) {
        // ^^ causes branch coverage warning, but needed to appease the Flow gods
        var mutatableState = {
          formState: state.formState,
          fields: state.fields,
          fieldSubscribers: state.fieldSubscribers,
          lastFormState: state.lastFormState
        }

        for (
          var _len = arguments.length, args = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key]
        }

        var returnValue = mutators[key](args, mutatableState, {
          changeValue: changeValue,
          getIn: getIn,
          renameField: renameField,
          setIn: setIn,
          shallowEqual: shallowEqual
        })
        state.formState = mutatableState.formState
        state.fields = mutatableState.fields
        state.fieldSubscribers = mutatableState.fieldSubscribers
        state.lastFormState = mutatableState.lastFormState
        runValidation(undefined, function() {
          notifyFieldListeners()
          notifyFormListeners()
        })
        return returnValue
      }
    }
  }

  var mutatorsApi = mutators
    ? Object.keys(mutators).reduce(function(result, key) {
        result[key] = getMutatorApi(key)
        return result
      }, {})
    : {}

  var runRecordLevelValidation = function runRecordLevelValidation(setErrors) {
    var promises = []

    if (validate) {
      var errorsOrPromise = validate(_extends({}, state.formState.values)) // clone to avoid writing

      if (isPromise(errorsOrPromise)) {
        var asyncValidationPromiseKey = nextAsyncValidationKey++
        var promise = errorsOrPromise
          .then(setErrors)
          .then(clearAsyncValidationPromise(asyncValidationPromiseKey))
        promises.push(promise)
        asyncValidationPromises[asyncValidationPromiseKey] = promise
      } else {
        setErrors(errorsOrPromise)
      }
    }

    return promises
  }

  var getValidators = function getValidators(field) {
    return Object.keys(field.validators).reduce(function(result, index) {
      var validator = field.validators[Number(index)]()

      if (validator) {
        result.push(validator)
      }

      return result
    }, [])
  }

  var runFieldLevelValidation = function runFieldLevelValidation(
    field,
    setError
  ) {
    var promises = []
    var validators = getValidators(field)

    if (validators.length) {
      var error
      validators.forEach(function(validator) {
        var errorOrPromise = validator(
          getIn(state.formState.values, field.name),
          state.formState.values,
          validator.length === 3
            ? publishFieldState(state.formState, state.fields[field.name])
            : undefined
        )

        if (errorOrPromise && isPromise(errorOrPromise)) {
          var asyncValidationPromiseKey = nextAsyncValidationKey++
          var promise = errorOrPromise
            .then(setError) // errors must be resolved, not rejected
            .then(clearAsyncValidationPromise(asyncValidationPromiseKey))
          promises.push(promise)
          asyncValidationPromises[asyncValidationPromiseKey] = promise
        } else if (!error) {
          // first registered validator wins
          error = errorOrPromise
        }
      })
      setError(error)
    }

    return promises
  }

  var runValidation = function runValidation(fieldChanged, callback) {
    if (validationPaused) {
      validationBlocked = true
      /* istanbul ignore next */

      if (callback) {
        callback()
      }

      return
    }

    var fields = state.fields,
      formState = state.formState
    var fieldKeys = Object.keys(fields)

    if (
      !validate &&
      !fieldKeys.some(function(key) {
        return getValidators(fields[key]).length
      })
    ) {
      if (callback) {
        callback()
      }

      return // no validation rules
    } // pare down field keys to actually validate

    var limitedFieldLevelValidation = false

    if (fieldChanged) {
      var changedField = fields[fieldChanged]

      if (changedField) {
        var validateFields = changedField.validateFields

        if (validateFields) {
          limitedFieldLevelValidation = true
          fieldKeys = validateFields.length
            ? validateFields.concat(fieldChanged)
            : [fieldChanged]
        }
      }
    }

    var recordLevelErrors = {}
    var fieldLevelErrors = {}
    var promises = [].concat(
      runRecordLevelValidation(function(errors) {
        recordLevelErrors = errors || {}
      }),
      fieldKeys.reduce(function(result, name) {
        return result.concat(
          runFieldLevelValidation(fields[name], function(error) {
            fieldLevelErrors[name] = error
          })
        )
      }, [])
    )

    var processErrors = function processErrors() {
      var merged = _extends(
        {},
        limitedFieldLevelValidation ? formState.errors : {},
        recordLevelErrors
      )

      var forEachError = function forEachError(fn) {
        fieldKeys.forEach(function(name) {
          if (fields[name]) {
            // make sure field is still registered
            // field-level errors take precedent over record-level errors
            var recordLevelError = getIn(recordLevelErrors, name)
            var errorFromParent = getIn(merged, name)
            var hasFieldLevelValidation = getValidators(fields[name]).length
            var fieldLevelError = fieldLevelErrors[name]
            fn(
              name,
              (hasFieldLevelValidation && fieldLevelError) ||
                (validate && recordLevelError) ||
                (!recordLevelError && !limitedFieldLevelValidation
                  ? errorFromParent
                  : undefined)
            )
          }
        })
      }

      forEachError(function(name, error) {
        merged = setIn(merged, name, error) || {}
      })
      forEachError(function(name, error) {
        if (error && error[ARRAY_ERROR]) {
          var existing = getIn(merged, name)
          var copy = [].concat(existing)
          copy[ARRAY_ERROR] = error[ARRAY_ERROR]
          merged = setIn(merged, name, copy)
        }
      })

      if (!shallowEqual(formState.errors, merged)) {
        formState.errors = merged
      }

      formState.error = recordLevelErrors[FORM_ERROR]
    } // process sync errors

    processErrors()

    if (promises.length) {
      // sync errors have been set. notify listeners while we wait for others
      state.formState.validating++

      if (callback) {
        callback()
      }

      var afterPromises = function afterPromises() {
        state.formState.validating--
        processErrors()

        if (callback) {
          callback()
        }
      }

      Promise.all(promises).then(afterPromises, afterPromises)
    } else if (callback) {
      callback()
    }
  }

  var notifyFieldListeners = function notifyFieldListeners(force) {
    if (inBatch || validationPaused) {
      return
    }

    var fields = state.fields,
      fieldSubscribers = state.fieldSubscribers,
      formState = state.formState
    Object.keys(fields).forEach(function(name) {
      var field = fields[name]
      var fieldState = publishFieldState(formState, field)
      var lastFieldState = field.lastFieldState

      if (!shallowEqual(fieldState, lastFieldState)) {
        // **************************************************************
        // Curious about why a field is getting notified? Uncomment this.
        // **************************************************************
        // const diffKeys = Object.keys(fieldState).filter(
        //   key => fieldState[key] !== (lastFieldState && lastFieldState[key])
        // )
        // console.debug(
        //   'notifying',
        //   name,
        //   '\nField State\n',
        //   diffKeys.reduce(
        //     (result, key) => ({ ...result, [key]: fieldState[key] }),
        //     {}
        //   ),
        //   '\nLast Field State\n',
        //   diffKeys.reduce(
        //     (result, key) => ({
        //       ...result,
        //       [key]: lastFieldState && lastFieldState[key]
        //     }),
        //     {}
        //   )
        // )
        field.lastFieldState = fieldState
        notify(
          fieldSubscribers[name],
          fieldState,
          lastFieldState,
          filterFieldState
        )
      }
    })
  }

  var markAllFieldsTouched = function markAllFieldsTouched() {
    Object.keys(state.fields).forEach(function(key) {
      state.fields[key].touched = true
    })
  }

  var hasSyncErrors = function hasSyncErrors() {
    return !!(state.formState.error || hasAnyError(state.formState.errors))
  }

  var calculateNextFormState = function calculateNextFormState() {
    var fields = state.fields,
      formState = state.formState,
      lastFormState = state.lastFormState
    var fieldKeys = Object.keys(fields) // calculate dirty/pristine

    var foundDirty = false
    var dirtyFields = fieldKeys.reduce(function(result, key) {
      var dirty = !fields[key].isEqual(
        getIn(formState.values, key),
        getIn(formState.initialValues || {}, key)
      )

      if (dirty) {
        foundDirty = true
        result[key] = true
      }

      return result
    }, {})
    formState.pristine = !foundDirty
    formState.dirtySinceLastSubmit = !!(
      formState.lastSubmittedValues &&
      !fieldKeys.every(function(key) {
        // istanbul ignore next
        var nonNullLastSubmittedValues = formState.lastSubmittedValues || {} // || {} is for flow, but causes branch coverage complaint

        return fields[key].isEqual(
          getIn(formState.values, key),
          getIn(nonNullLastSubmittedValues, key)
        )
      })
    )
    formState.valid =
      !formState.error &&
      !formState.submitError &&
      !hasAnyError(formState.errors) &&
      !(formState.submitErrors && hasAnyError(formState.submitErrors))
    var nextFormState = convertToExternalFormState(formState)

    var _fieldKeys$reduce = fieldKeys.reduce(
        function(result, key) {
          result.touched[key] = fields[key].touched
          result.visited[key] = fields[key].visited
          return result
        },
        {
          touched: {},
          visited: {}
        }
      ),
      touched = _fieldKeys$reduce.touched,
      visited = _fieldKeys$reduce.visited

    nextFormState.dirtyFields =
      lastFormState && shallowEqual(lastFormState.dirtyFields, dirtyFields)
        ? lastFormState.dirtyFields
        : dirtyFields
    nextFormState.touched =
      lastFormState && shallowEqual(lastFormState.touched, touched)
        ? lastFormState.touched
        : touched
    nextFormState.visited =
      lastFormState && shallowEqual(lastFormState.visited, visited)
        ? lastFormState.visited
        : visited
    return lastFormState && shallowEqual(lastFormState, nextFormState)
      ? lastFormState
      : nextFormState
  }

  var callDebug = function callDebug() {
    return (
      debug &&
      process.env.NODE_ENV !== 'production' &&
      debug(
        calculateNextFormState(),
        Object.keys(state.fields).reduce(function(result, key) {
          result[key] = state.fields[key]
          return result
        }, {})
      )
    )
  }

  var notifying = false
  var scheduleNotification = false

  var notifyFormListeners = function notifyFormListeners() {
    if (notifying) {
      scheduleNotification = true
    } else {
      notifying = true
      callDebug()

      if (!inBatch && !validationPaused) {
        var lastFormState = state.lastFormState
        var nextFormState = calculateNextFormState()

        if (nextFormState !== lastFormState) {
          state.lastFormState = nextFormState
          notify(
            state.subscribers,
            nextFormState,
            lastFormState,
            filterFormState
          )
        }
      }

      notifying = false

      if (scheduleNotification) {
        scheduleNotification = false
        notifyFormListeners()
      }
    }
  } // generate initial errors

  runValidation()
  var api = {
    batch: function batch(fn) {
      inBatch = true
      fn()
      inBatch = false
      notifyFieldListeners()
      notifyFormListeners()
    },
    blur: function blur(name) {
      var fields = state.fields,
        formState = state.formState
      var previous = fields[name]

      if (previous) {
        // can only blur registered fields
        delete formState.active
        fields[name] = _extends({}, previous, {
          active: false,
          touched: true
        })

        if (validateOnBlur) {
          runValidation(name, function() {
            notifyFieldListeners()
            notifyFormListeners()
          })
        } else {
          notifyFieldListeners()
          notifyFormListeners()
        }
      }
    },
    change: function change(name, value) {
      var formState = state.formState

      if (getIn(formState.values, name) !== value) {
        changeValue(state, name, function() {
          return value
        })

        if (validateOnBlur) {
          notifyFieldListeners()
          notifyFormListeners()
        } else {
          runValidation(name, function() {
            notifyFieldListeners()
            notifyFormListeners()
          })
        }
      }
    },
    focus: function focus(name) {
      var field = state.fields[name]

      if (field && !field.active) {
        state.formState.active = name
        field.active = true
        field.visited = true
        notifyFieldListeners()
        notifyFormListeners()
      }
    },
    mutators: mutatorsApi,
    getFieldState: function getFieldState(name) {
      var field = state.fields[name]
      return field && field.lastFieldState
    },
    getRegisteredFields: function getRegisteredFields() {
      return Object.keys(state.fields)
    },
    getState: function getState() {
      return calculateNextFormState()
    },
    initialize: function initialize(values) {
      var fields = state.fields,
        formState = state.formState

      if (!keepDirtyOnReinitialize) {
        formState.values = values
      }

      Object.keys(fields).forEach(function(key) {
        var field = fields[key]
        field.touched = false
        field.visited = false

        if (keepDirtyOnReinitialize) {
          var pristine = fields[key].isEqual(
            getIn(formState.values, key),
            getIn(formState.initialValues || {}, key)
          )

          if (pristine) {
            // only update pristine values
            formState.values = setIn(formState.values, key, getIn(values, key))
          }
        }
      })
      formState.initialValues = values
      runValidation(undefined, function() {
        notifyFieldListeners()
        notifyFormListeners()
      })
    },
    isValidationPaused: function isValidationPaused() {
      return validationPaused
    },
    pauseValidation: function pauseValidation() {
      validationPaused = true
    },
    registerField: function registerField(
      name,
      subscriber,
      subscription,
      fieldConfig
    ) {
      if (subscription === void 0) {
        subscription = {}
      }

      if (!state.fieldSubscribers[name]) {
        state.fieldSubscribers[name] = {
          index: 0,
          entries: {}
        }
      }

      var index = state.fieldSubscribers[name].index++ // save field subscriber callback

      state.fieldSubscribers[name].entries[index] = {
        subscriber: memoize(subscriber),
        subscription: subscription
      }

      if (!state.fields[name]) {
        // create initial field state
        var initial = state.formState.initialValues
          ? getIn(state.formState.initialValues, name)
          : undefined
        state.fields[name] = {
          active: false,
          blur: function blur() {
            return api.blur(name)
          },
          change: function change(value) {
            return api.change(name, value)
          },
          data: {},
          focus: function focus() {
            return api.focus(name)
          },
          initial: initial,
          isEqual: (fieldConfig && fieldConfig.isEqual) || tripleEquals,
          lastFieldState: undefined,
          name: name,
          touched: false,
          valid: true,
          validateFields: fieldConfig && fieldConfig.validateFields,
          validators: {},
          visited: false
        }
      }

      if (fieldConfig && fieldConfig.getValidator) {
        state.fields[name].validators[index] = fieldConfig.getValidator
      }

      var sentFirstNotification = false

      var firstNotification = function firstNotification() {
        var fieldState = publishFieldState(state.formState, state.fields[name])
        notifySubscriber(
          subscriber,
          subscription,
          fieldState,
          undefined,
          filterFieldState,
          true
        )
        state.fields[name].lastFieldState = fieldState
        sentFirstNotification = true
      }

      runValidation(undefined, function() {
        notifyFormListeners()

        if (!sentFirstNotification) {
          firstNotification()
        }

        notifyFieldListeners()
      })
      return function() {
        delete state.fields[name].validators[index]
        delete state.fieldSubscribers[name].entries[index]

        if (!Object.keys(state.fieldSubscribers[name].entries).length) {
          delete state.fieldSubscribers[name]
          delete state.fields[name]
          state.formState.errors =
            setIn(state.formState.errors, name, undefined) || {}

          if (destroyOnUnregister) {
            state.formState.values =
              setIn(state.formState.values, name, undefined) || {}
          }
        }

        runValidation(undefined, function() {
          notifyFieldListeners()
          notifyFormListeners()
        })
      }
    },
    reset: function reset(initialValues) {
      if (initialValues === void 0) {
        initialValues = state.formState.initialValues
      }

      state.formState.submitFailed = false
      state.formState.submitSucceeded = false
      delete state.formState.submitError
      delete state.formState.submitErrors
      delete state.formState.lastSubmittedValues
      api.initialize(initialValues || {})
    },
    resumeValidation: function resumeValidation() {
      validationPaused = false

      if (validationBlocked) {
        // validation was attempted while it was paused, so run it now
        runValidation(undefined, function() {
          notifyFieldListeners()
          notifyFormListeners()
        })
      }

      validationBlocked = false
    },
    setConfig: function setConfig(name, value) {
      switch (name) {
        case 'debug':
          debug = value
          break

        case 'destroyOnUnregister':
          destroyOnUnregister = value
          break

        case 'initialValues':
          api.initialize(value)
          break

        case 'keepDirtyOnReinitialize':
          keepDirtyOnReinitialize = value
          break

        case 'mutators':
          mutators = value

          if (value) {
            Object.keys(mutatorsApi).forEach(function(key) {
              if (!(key in value)) {
                delete mutatorsApi[key]
              }
            })
            Object.keys(value).forEach(function(key) {
              mutatorsApi[key] = getMutatorApi(key)
            })
          } else {
            Object.keys(mutatorsApi).forEach(function(key) {
              delete mutatorsApi[key]
            })
          }

          break

        case 'onSubmit':
          onSubmit = value
          break

        case 'validate':
          validate = value
          runValidation(undefined, function() {
            notifyFieldListeners()
            notifyFormListeners()
          })
          break

        case 'validateOnBlur':
          validateOnBlur = value
          break

        default:
          throw new Error('Unrecognised option ' + name)
      }
    },
    submit: function submit() {
      var formState = state.formState

      if (hasSyncErrors()) {
        markAllFieldsTouched()
        state.formState.submitFailed = true
        notifyFormListeners()
        notifyFieldListeners()
        return // no submit for you!!
      }

      var asyncValidationPromisesKeys = Object.keys(asyncValidationPromises)

      if (asyncValidationPromisesKeys.length) {
        // still waiting on async validation to complete...
        Promise.all(
          asyncValidationPromisesKeys.reduce(function(result, key) {
            result.push(asyncValidationPromises[Number(key)])
            return result
          }, [])
        ).then(api.submit, api.submit)
        return
      }

      var resolvePromise
      var completeCalled = false

      var complete = function complete(errors) {
        formState.submitting = false

        if (errors && hasAnyError(errors)) {
          formState.submitFailed = true
          formState.submitSucceeded = false
          formState.submitErrors = errors
          formState.submitError = errors[FORM_ERROR]
          markAllFieldsTouched()
        } else {
          delete formState.submitErrors
          delete formState.submitError
          formState.submitFailed = false
          formState.submitSucceeded = true
        }

        notifyFormListeners()
        notifyFieldListeners()
        completeCalled = true

        if (resolvePromise) {
          resolvePromise(errors)
        }

        return errors
      }

      formState.submitting = true
      formState.submitFailed = false
      formState.submitSucceeded = false
      formState.lastSubmittedValues = _extends({}, formState.values) // onSubmit is either sync, callback or async with a Promise

      var result = onSubmit(formState.values, api, complete)

      if (!completeCalled) {
        if (result && isPromise(result)) {
          // onSubmit is async with a Promise
          notifyFormListeners() // let everyone know we are submitting

          notifyFieldListeners() // notify fields also

          return result.then(complete, function(error) {
            complete()
            throw error
          })
        } else if (onSubmit.length >= 3) {
          // must be async, so we should return a Promise
          notifyFormListeners() // let everyone know we are submitting

          notifyFieldListeners() // notify fields also

          return new Promise(function(resolve) {
            resolvePromise = resolve
          })
        } else {
          // onSubmit is sync
          complete(result)
        }
      }
    },
    subscribe: function subscribe(subscriber, subscription) {
      if (!subscriber) {
        throw new Error('No callback given.')
      }

      if (!subscription) {
        throw new Error(
          'No subscription provided. What values do you want to listen to?'
        )
      }

      var memoized = memoize(subscriber)
      var subscribers = state.subscribers,
        lastFormState = state.lastFormState
      var index = subscribers.index++
      subscribers.entries[index] = {
        subscriber: memoized,
        subscription: subscription
      }
      var nextFormState = calculateNextFormState()

      if (nextFormState !== lastFormState) {
        state.lastFormState = nextFormState
      }

      notifySubscriber(
        memoized,
        subscription,
        nextFormState,
        nextFormState,
        filterFormState,
        true
      )
      return function() {
        delete subscribers.entries[index]
      }
    }
  }
  return api
}

//

exports.createForm = createForm
exports.configOptions = configOptions
exports.version = version
exports.ARRAY_ERROR = ARRAY_ERROR
exports.FORM_ERROR = FORM_ERROR
exports.formSubscriptionItems = formSubscriptionItems
exports.fieldSubscriptionItems = fieldSubscriptionItems
exports.getIn = getIn
exports.setIn = setIn
