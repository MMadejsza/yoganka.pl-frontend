import { useMutation } from '@tanstack/react-query';
import { useAuthStatus } from '../../../../hooks/useAuthStatus.js';
import { useFeedback } from '../../../../hooks/useFeedback.js';
import { useInput } from '../../../../hooks/useInput.js';
import { mutateOnCreate, queryClient } from '../../../../utils/http.js';
import * as val from '../../../../utils/validation.js';
import WrapperForm from '../../../backend/WrapperForm.jsx';
import FeedbackBox from '../../FeedbackBox.jsx';
import Input from '../../Input.jsx';

function NewProductForm() {
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    mutate: createProduct,
    isPending: isCreateProductPending,
    isError: isCreateProductError,
    error: createProductError,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/admin-console/create-product`),

    onSuccess: res => {
      queryClient.invalidateQueries(['/admin-console/show-all-products']);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  // using custom hook with extracting and reassigning its 'return' for particular inputs and assign validation methods from imported utils. Every inout has its won state now
  const {
    value: nameValue,
    handleChange: handleNameChange,
    handleFocus: handleNameFocus,
    handleBlur: handleNameBlur,
    handleReset: handleNameReset,
    didEdit: nameDidEdit,
    isFocused: nameIsFocused,
    validationResults: nameValidationResults,
    hasError: nameHasError,
  } = useInput('', val.productNameValidations);
  const {
    value: productTypeValue,
    handleChange: handleProductTypeChange,
    handleFocus: handleProductTypeFocus,
    handleBlur: handleProductTypeBlur,
    handleReset: handleProductTypeReset,
    didEdit: productTypeDidEdit,
    isFocused: productTypeIsFocused,
    validationResults: productTypeValidationResults,
    hasError: productTypeHasError,
  } = useInput('Online');
  const {
    value: locationValue,
    handleChange: handleLocationChange,
    handleFocus: handleLocationFocus,
    handleBlur: handleLocationBlur,
    handleReset: handleLocationReset,
    didEdit: locationDidEdit,
    isFocused: locationIsFocused,
    validationResults: locationValidationResults,
    hasError: locationHasError,
  } = useInput('', val.locationValidations);
  const {
    value: durationValue,
    handleChange: handleDurationChange,
    handleFocus: handleDurationFocus,
    handleBlur: handleDurationBlur,
    handleReset: handleDurationReset,
    didEdit: durationDidEdit,
    isFocused: durationIsFocused,
    validationResults: durationValidationResults,
    hasError: durationHasError,
  } = useInput(1, val.productDurationValidations);
  const {
    value: StartDateValue,
    handleChange: handleStartDateChange,
    handleFocus: handleStartDateFocus,
    handleBlur: handleStartDateBlur,
    handleReset: handleStartDateReset,
    didEdit: StartDateDidEdit,
    isFocused: StartDateIsFocused,
    validationResults: StartDateValidationResults,
    hasError: StartDateHasError,
  } = useInput('');
  const {
    value: priceValue,
    handleChange: handlePriceChange,
    handleFocus: handlePriceFocus,
    handleBlur: handlePriceBlur,
    handleReset: handlePriceReset,
    didEdit: priceDidEdit,
    isFocused: priceIsFocused,
    validationResults: priceValidationResults,
    hasError: priceHasError,
  } = useInput(' ', val.priceValidations);
  const {
    value: statusValue,
    handleChange: handleStatusChange,
    handleFocus: handleStatusFocus,
    handleBlur: handleStatusBlur,
    handleReset: handleStatusReset,
    didEdit: statusDidEdit,
    isFocused: statusIsFocused,
    validationResults: statusValidationResults,
    hasError: statusHasError,
  } = useInput('Aktywny');
  const {
    value: defAttendanceViewValue,
    handleChange: handleDefAttendanceViewChange,
    handleFocus: handleDefAttendanceViewFocus,
    handleBlur: handleDefAttendanceViewBlur,
    handleReset: handleDefAttendanceViewReset,
    didEdit: defAttendanceViewDidEdit,
    isFocused: defAttendanceViewIsFocused,
    validationResults: defAttendanceViewValidationResults,
    hasError: defAttendanceViewHasError,
  } = useInput('1');

  // Reset all te inputs
  const handleReset = () => {
    resetFeedback();

    handleNameReset();
    handleProductTypeReset();
    handleLocationReset();
    handleDurationReset();
    handleStartDateReset();
    handlePriceReset();
    handleStatusReset();
    handleDefAttendanceViewReset();
  };

  // Submit handling
  const handleSubmit = async e => {
    e.preventDefault(); // No reloading
    console.log('Submit triggered');

    if (
      priceHasError ||
      statusHasError ||
      locationHasError ||
      durationHasError ||
      StartDateHasError ||
      nameHasError ||
      productTypeHasError ||
      defAttendanceViewHasError
    ) {
      return;
    }
    console.log('Submit passed errors');

    const fd = new FormData(e.target);
    const formDataObj = Object.fromEntries(fd.entries());
    console.log('sent data:', formDataObj);
    createProduct(formDataObj);
    if (feedback.confirmation == 1) handleReset();
  };

  // Dynamically set descriptive names when switching from login in to registration
  const formLabels = {
    formType: 'login',
    title: 'Dodanie zajęć do systemu',
    actionTitle: 'Zatwierdź',
  };

  // Extract values only
  const { formType, title, actionTitle } = formLabels;

  const form = (
    <WrapperForm
      title={''}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitLabel={actionTitle}
      resetLabel='Resetuj'
    >
      <Input
        embedded={true}
        formType={formType}
        type='text'
        id='name'
        name='name'
        label='Nazwa w systemie: *'
        placeholder='Etykieta rozpoznawcza - dla uczestników'
        value={nameValue}
        onFocus={handleNameFocus}
        onBlur={handleNameBlur}
        onChange={handleNameChange}
        autoComplete='off'
        required
        validationResults={nameValidationResults}
        didEdit={nameDidEdit}
        isFocused={nameIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Online', value: 'ONLINE' },
          { label: 'Camp', value: 'CAMP' },
          { label: 'Event', value: 'EVENT' },
          { label: 'Class', value: 'CLASS' },
        ]}
        id='productType'
        name='productType'
        label='Typ zajęć: *'
        value={productTypeValue}
        required
        onFocus={handleProductTypeFocus}
        onBlur={handleProductTypeBlur}
        onChange={handleProductTypeChange}
        validationResults={productTypeValidationResults}
        didEdit={productTypeDidEdit}
        isFocused={productTypeIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='date'
        id='startDate'
        name='startDate'
        label='Data rozpoczęcia: *'
        value={StartDateValue}
        onFocus={handleStartDateFocus}
        onBlur={handleStartDateBlur}
        onChange={handleStartDateChange}
        autoComplete='off'
        required
        validationResults={StartDateValidationResults}
        didEdit={StartDateDidEdit}
        isFocused={StartDateIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='number'
        id='duration'
        name='duration'
        step='0.25'
        min='0'
        label='Czas trwania (h): *'
        placeholder='h'
        required
        value={durationValue}
        onFocus={handleDurationFocus}
        onBlur={handleDurationBlur}
        onChange={handleDurationChange}
        validationResults={durationValidationResults}
        didEdit={durationDidEdit}
        isFocused={durationIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='text'
        id='location'
        name='location'
        label='Miejsce: *'
        placeholder='Etykieta rozpoznawcza - dla uczestników'
        value={locationValue}
        autoComplete='off'
        onFocus={handleLocationFocus}
        onBlur={handleLocationBlur}
        onChange={handleLocationChange}
        validationResults={locationValidationResults}
        didEdit={locationDidEdit}
        isFocused={locationIsFocused}
        required
      />
      <Input
        embedded={true}
        formType={formType}
        type='decimal'
        id='price'
        name='price'
        min={2}
        label='Cena: *'
        value={priceValue}
        placeholder='Widoczny dla uczestników'
        required
        onFocus={handlePriceFocus}
        onBlur={handlePriceBlur}
        onChange={handlePriceChange}
        validationResults={priceValidationResults}
        didEdit={priceDidEdit}
        isFocused={priceIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Aktywny', value: 1 },
          { label: 'Zakończony', value: -1 },
          { label: 'Zawieszony', value: 0 },
        ]}
        id='status'
        name='status'
        label='Status:'
        value={statusValue}
        required
        onFocus={handleStatusFocus}
        onBlur={handleStatusBlur}
        onChange={handleStatusChange}
        validationResults={statusValidationResults}
        didEdit={statusDidEdit}
        isFocused={statusIsFocused}
      />
      <Input
        embedded={true}
        formType={formType}
        type='select'
        options={[
          { label: 'Pełna Frekwencja', value: 2 },
          { label: 'Tylko liczba os.', value: 1 },
          { label: 'Tylko pojemność', value: 0 },
          { label: 'Brak', value: -1 },
        ]}
        id='defaultAttendanceViewMode'
        name='defaultAttendanceViewMode'
        label='Domyślny w. os.:'
        value={defAttendanceViewValue}
        required
        onFocus={handleDefAttendanceViewFocus}
        onBlur={handleDefAttendanceViewBlur}
        onChange={handleDefAttendanceViewChange}
        validationResults={defAttendanceViewValidationResults}
        didEdit={defAttendanceViewDidEdit}
        isFocused={defAttendanceViewIsFocused}
      />
      {feedback.status !== undefined && (
        <FeedbackBox
          onCloseFeedback={resetFeedback}
          status={feedback.status}
          isPending={isCreateProductPending}
          isError={isCreateProductError}
          error={createProductError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </WrapperForm>
  );

  return (
    <>
      <h1 className='modal__title modal__title--view'>{title}</h1>
      {form}
    </>
  );
}

export default NewProductForm;
