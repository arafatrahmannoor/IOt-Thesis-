import PageHeader from "../../components/ui/PageHeader";
import InDevelopment from "../../components/common/InDevelopment";
import { FiClock } from "react-icons/fi";

function History() {

  return (
    <div className="flex flex-col gap-1">
      <PageHeader
        title="Monitoring History"
        subtitle="View your health monitoring sessions and access reports"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "History" },
        ]}
      />

      {/* In Development Message */}
      <InDevelopment
        title="History Feature In Development"
        description="The history tracking functionality is currently under development. Monitoring session history and reports will be available soon."
        icon={<FiClock className="w-10 h-10 text-yellow-600" />}
      />
    </div>
  );
}

export default History;

