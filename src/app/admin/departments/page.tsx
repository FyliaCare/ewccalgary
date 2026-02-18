"use client";

import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";

interface DepartmentData {
  id: string;
  name: string;
  description: string;
  leader: string;
  icon: string;
  _count?: { volunteers: number };
  volunteers?: { id: string }[];
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/departments");
        if (res.ok) setDepartments(await res.json());
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getVolunteerCount = (dept: DepartmentData) => {
    if (dept._count?.volunteers !== undefined) return dept._count.volunteers;
    if (dept.volunteers) return dept.volunteers.length;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-ewc-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Departments</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ministry departments and volunteer assignments.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2 text-sm text-gray-600">
          {departments.length} departments
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400">No departments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-ewc-burgundy/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-bold text-gray-900 text-sm">
                  {dept.name}
                </h3>
              </div>
              <p className="text-gray-500 text-xs mb-4">{dept.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users size={14} className="text-ewc-burgundy" />
                  <span className="text-gray-900 font-semibold">{getVolunteerCount(dept)}</span>
                  <span className="text-gray-500 text-xs">volunteers</span>
                </div>
                <span className="text-gray-400 text-xs">
                  Lead: {dept.leader || "TBD"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
