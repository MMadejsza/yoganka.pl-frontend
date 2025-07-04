import { useLocation, useNavigate } from 'react-router-dom';
import { statsCalculatorForCustomer } from '../../../utils/statistics/statsCalculatorForCustomer.js';
import CardsList from '../../backend/cards/CardsList.jsx';
import ModalTable from '../ModalTable.jsx';
import ViewsController from '../ViewsController.jsx';
import WrapperModalTable from '../WrapperModalTable.jsx';

function ViewAccountDashboard({ data, queryStatus }) {
  // console.clear();
  console.log(`✅ Data: `);
  console.log(data);

  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };

  const handleOpenScheduleModal = row => {
    navigate(`grafik/${row.scheduleId}`, { state: { background } });
  };

  const handleCloseModal = () => {
    navigate('/rezerwacje');
  };

  let name, customer, customerStats, statsBlock, contentUpcoming;
  const headers = [
    'Id',
    'Data',
    'Dzień',
    'Godzina',
    'Typ',
    'Zajęcia',
    'Miejsce',
  ];
  if (data.customer) {
    customer = data.customer;
    name = `${customer.firstName} ${customer.lastName}`;
    customerStats = statsCalculatorForCustomer(data.customer);

    const content = customerStats.attendedSchedules;
    contentUpcoming = content
      .filter(
        schedule =>
          new Date(`${schedule.date}T${schedule.startTime}.000Z`) >= today
      )
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.startTime}.000Z`) -
          new Date(`${b.date}T${b.startTime}.000Z`)
      );
    console.log('contentUpcoming', contentUpcoming);
  }

  if (queryStatus.isError) {
    console.log(queryStatus?.error?.code);
    if (error.code == 401) {
      navigate('/login');
      console.log(queryStatus?.error?.message);
    } else {
      window.alert(
        queryStatus?.error.info?.message ||
          'Błąd serwera - pobieranie danych uczestnika przerwane'
      );
    }
  }

  const cards = (
    <CardsList
      content={contentUpcoming}
      active={true}
      onOpen={handleOpenScheduleModal}
      notToArchive={true}
      explicitType={'schedule'}
    />
  );
  const tableInside = (
    <ModalTable
      headers={headers}
      keys={[
        'scheduleId',
        'date',
        'day',
        'startTime',
        'productType',
        'productName',
        'location',
      ]}
      content={contentUpcoming}
      active={true}
      onOpen={handleOpenScheduleModal}
      classModifier={'user-account'}
    />
  );

  const table = (
    <WrapperModalTable
      content={contentUpcoming}
      title={'Nadchodząca Yoga'}
      noContentMsg={'nowych rezerwacji'}
    >
      {/* {tableInside} */}
      {cards}
    </WrapperModalTable>
  );
  return (
    <>
      {statsBlock}
      {table}

      <ViewsController
        modifier='schedule'
        onClose={handleCloseModal}
        userAccountPage={true}
        customer={customer}
      />
    </>
  );
}

export default ViewAccountDashboard;
