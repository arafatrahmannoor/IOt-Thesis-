import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  FileText,
  Users,
} from "lucide-react";

interface StatsCardsProps {
  data: any;
  isLoading?: boolean;
}

export default function StatsCards({ data, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl col-span-4 p-4 border border-gray-200 animate-pulse shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  <div className="w-8 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statistics = data?.data;
  const trend = statistics?.trend; // ✅ Extract trend first

  const trendKeyMap: Record<string, string> = {
    jobs: "jobs",
    applicants: "applications",
    careerJobs: "career_jobs",
    courses: "courses",
    enrollment: "enrolled_courses",
    blogs: "blogs",
  };

  const getCardTrendData = (cardKey: string, period: string = "30d") => {
    const trendData = trend?.[trendKeyMap[cardKey]]?.[period];
    if (!trendData) return { change: 0, isPositive: true, trend: "up" };

    const prev = trendData.prev || 0;
    const current = trendData.current || 0;

    const change =
      prev > 0 ? Math.round(((current - prev) / prev) * 100) : current;
    return {
      change: Math.abs(change),
      isPositive: current >= prev,
      trend: current >= prev ? "up" : "down",
    };
  };

  const stats = [
    {
      title: statistics?.jobs?.label || "Total Jobs",
      value: statistics?.jobs?.total || 0,
      icon: Briefcase,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
      cardBg: "bg-gradient-to-br from-white to-emerald-50/50",
      borderColor: "border-emerald-200",
      trend: getCardTrendData("jobs", "30d"),
      subtitle: "Active positions",
      additionalInfo: statistics?.jobs?.total || 0,
      period: "30d",
    },
    {
      title: statistics?.applicants?.label || "Job Applicants",
      value: statistics?.applicants?.total || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      cardBg: "bg-gradient-to-br from-white to-blue-50/50",
      borderColor: "border-blue-200",
      trend: getCardTrendData("applicants", "7d"),
      subtitle: "This month",
      additionalInfo: statistics?.applicants?.total || 0,
      period: "7d",
    },
    {
      title: statistics?.careerJobs?.label || "Career Jobs",
      value: statistics?.careerJobs?.total || 0,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      cardBg: "bg-gradient-to-br from-white to-purple-50/50",
      borderColor: "border-purple-200",
      trend: getCardTrendData("careerJobs", "24h"),
      subtitle: "Available positions",
      additionalInfo: statistics?.careerJobs?.total || 0,
      period: "24h",
    },
    {
      title: statistics?.courses?.label || "Total Courses",
      value: statistics?.courses?.total || 0,
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      cardBg: "bg-gradient-to-br from-white to-orange-50/50",
      borderColor: "border-orange-200",
      trend: getCardTrendData("courses", "12m"),
      subtitle: "Active courses",
      additionalInfo: statistics?.courses?.total || 0,
      period: "12m",
    },
    {
      title: statistics?.enrollment?.label || "Total Enrollment",
      value: statistics?.enrollment?.total || 0,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      cardBg: "bg-gradient-to-br from-white to-indigo-50/50",
      borderColor: "border-indigo-200",
      trend: getCardTrendData("enrollment", "30d"),
      subtitle: "This semester",
      additionalInfo: statistics?.enrollment?.total || 0,
      period: "30d",
    },
    {
      title: statistics?.blogs?.label || "Total Blogs",
      value: statistics?.blogs?.total || 0,
      icon: FileText,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-rose-100",
      iconColor: "text-rose-600",
      cardBg: "bg-gradient-to-br from-white to-rose-50/50",
      borderColor: "border-rose-200",
      trend: getCardTrendData("blogs", "7d"),
      subtitle: "Published",
      additionalInfo: statistics?.blogs?.total || 0,
      period: "7d",
    },
  ];

  console.log("stats", stats);
  return (
    <div className="grid grid-cols-12 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`
        ${stat.cardBg} rounded-xl 
        col-span-12 sm:col-span-6 lg:col-span-4 
        p-4 border ${stat.borderColor} 
        hover:shadow-xl transition-all duration-300 
        hover:-translate-y-1 relative overflow-hidden
      `}
        >
          {/* Gradient decorations */}
          <div
            className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-4 translate-x-4`}
          ></div>
          <div
            className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${stat.color} opacity-3 rounded-full`}
          ></div>

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`${stat.bgColor} p-2.5 rounded-lg shadow-md border border-white/50`}
              >
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>

              {/* Trend indicator */}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm border ${
                  stat.trend.isPositive
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {stat.trend.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.trend.isPositive
                  ? `+${stat.trend.change}%`
                  : `-${stat.trend.change}%`}
              </div>
            </div>

            {/* Main content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </h3>
                <p className="text-lg font-bold text-gray-900">
                  {stat.value?.toLocaleString() || 0}
                </p>
              </div>

              {/* Additional info */}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                <span>{stat.subtitle}</span>
                <span className="font-semibold text-gray-700">
                  {stat.additionalInfo?.toLocaleString() || 0}
                </span>
              </div>
              <div className="text-xs text-gray-400">{stat.period}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
