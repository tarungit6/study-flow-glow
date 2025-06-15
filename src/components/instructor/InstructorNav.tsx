
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText, BarChart3, Settings } from 'lucide-react';

const navItems = [
  {
    title: 'Upload Content',
    href: '/instructor/upload',
    icon: Upload,
    description: 'Add YouTube videos and educational materials'
  },
  {
    title: 'Create Tests',
    href: '/instructor/tests',
    icon: FileText,
    description: 'Design assessments and quizzes'
  },
  {
    title: 'Analytics',
    href: '/instructor/analytics',
    icon: BarChart3,
    description: 'View student engagement and performance'
  },
  {
    title: 'Settings',
    href: '/instructor/settings',
    icon: Settings,
    description: 'Manage your instructor profile'
  }
];

export function InstructorNav() {
  const location = useLocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link key={item.href} to={item.href} className="group">
            <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-md ${
              isActive 
                ? 'bg-primary/5 border-primary shadow-sm' 
                : 'bg-card border-border hover:border-primary/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted text-muted-foreground group-hover:text-primary'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}>
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
