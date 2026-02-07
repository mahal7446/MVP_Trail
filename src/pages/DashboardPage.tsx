import { motion } from "framer-motion";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { Leaf, TrendingUp, Shield, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const stats = [
  {
    label: "Total Scans",
    value: "127",
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/50"
  },
  {
    label: "Diseases Detected",
    value: "23",
    icon: Shield,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/50"
  },
  {
    label: "Accuracy Rate",
    value: "94%",
    icon: TrendingUp,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/50"
  },
  {
    label: "Community Farmers",
    value: "5.2K",
    icon: Users,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/50"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          {t('dashboard.welcome')},{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            Farmer!
          </span>{" "}
          🌾
        </h1>
        <p className="text-muted-foreground">
          {t('upload.subtitle')}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl ${stat.shadowColor} transition-all duration-300`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`} />

                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                <CardContent className="relative p-4 flex items-center gap-3 text-white">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-3 rounded-xl bg-white/20 backdrop-blur-md"
                  >
                    <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-3xl font-bold drop-shadow-md"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-white/90 font-medium">{stat.label}</p>
                  </div>
                </CardContent>

                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Weather Widget */}
      <motion.div variants={itemVariants}>
        <WeatherWidget />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        className="grid lg:grid-cols-2 gap-6"
      >
        {/* Upload Section */}
        <motion.div variants={itemVariants}>
          <UploadSection />
        </motion.div>

        {/* Recent Scans */}
        <motion.div variants={itemVariants}>
          <RecentScans />
        </motion.div>
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-primary/30 shadow-lg hover:shadow-xl transition-shadow">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />

          <CardContent className="relative p-4 sm:p-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-semibold text-lg mb-4 flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              Tips for Best Results
            </motion.h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              {[
                "Take photos in good natural lighting",
                "Focus on the affected area of the plant",
                "Include both healthy and diseased parts if possible",
                "Avoid blurry or shadowy images"
              ].map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, color: "hsl(var(--primary))" }}
                  className="flex items-start gap-2 cursor-default transition-colors"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    className="text-primary text-lg"
                  >
                    •
                  </motion.span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
