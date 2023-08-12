import PendingPaymentsWidget from "../../components/widgets/PendingPaymentsWidget";
import LastPayrollTotalWidget from "../../components/widgets/LastPayrollTotalWidget";
import NextPayrollTotalWidget from "../../components/widgets/NextPayrollTotalWidget";
import ActiveUsersWidget from "../../components/widgets/ActiveUsersWidget";
import LastBonusTotalWidget from "../../components/widgets/LastBonusTotalWidget";
import NextBonusAndCompWidget from "../../components/widgets/NextBonusAndCompWidget";
import ActiveAdminsWidget from "../../components/widgets/ActiveAdminsWidget";

const AdminOverview = () => {
  return (
    <main className="page-layout">
      <h1 className="page-heading">Overview</h1>
      <div className="page-content">
        <PendingPaymentsWidget />

        <div className="top-form-container">
          <div className="widget-item">
            <LastPayrollTotalWidget />
            <div className="widget-footer-blue"></div>
          </div>
          <div className="widget-item">
            <NextPayrollTotalWidget />
            <div className="widget-footer-blue"></div>
          </div>
          <div className="widget-item">
            <ActiveUsersWidget />
            <div className="widget-footer-green"></div>
          </div>
        </div>
        <div className="top-form-container">
          <div className="widget-item">
            <ActiveAdminsWidget />
            <div className="widget-footer-green"></div>
          </div>
          <div className="widget-item">
            <LastBonusTotalWidget />
            <div className="widget-footer-blue"></div>
          </div>
          <div className="widget-item">
            <NextBonusAndCompWidget />
            <div className="widget-footer-green"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminOverview;
