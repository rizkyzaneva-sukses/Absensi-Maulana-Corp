import type {
  Company, Employee, Attendance, LeaveRequest, OvertimeRequest,
  AttendanceCorrection, Team, PayrollRecord, Notification, Holiday, Location
} from '@/types';

export const companies: Company[] = [
  {
    "id": "comp_elyasr",
    "name": "ELYASR",
    "slug": "elyasr",
    "logo_url": "",
    "industry": "Retail & Fashion",
    "address": "Bandung, Jawa Barat",
    "npwp": "01.234.567.8-901.000",
    "is_active": true,
    "owner_email": "rizkyzaneva@gmail.com",
    "subscription_plan": "ENTERPRISE",
    "max_employees": 100,
    "created_at": "2026-01-21",
    "updated_at": "2026-05-05"
  }
];

export const employees: Employee[] = [
  {
    "id": "69cc9ba87030f27d5b9bd839",
    "company_id": "comp_elyasr",
    "user_email": "rizkyzaneva@gmail.com",
    "employee_id": "OWN-1",
    "full_name": "Muhammad Rizky Maulana",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "SUPER_ADMIN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 12,
    "cuti_sakit": 12,
    "base_salary": 0,
    "tunjangan_kesehatan": 0,
    "uang_kehadiran": 0,
    "uang_transport": 0,
    "uang_makan": 0,
    "created_at": "2026-04-01"
  },
  {
    "id": "69a168535c11687be484d192",
    "company_id": "comp_elyasr",
    "user_email": "yasrikhaira1@gmail.com",
    "employee_id": "ADM01",
    "full_name": "Yasri Khaira",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "COMPANY_ADMIN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 12,
    "cuti_sakit": 12,
    "base_salary": 0,
    "tunjangan_kesehatan": 0,
    "uang_kehadiran": 0,
    "uang_transport": 0,
    "uang_makan": 0,
    "created_at": "2026-02-27"
  },
  {
    "id": "69705cec51ca2bef9c5ccdd7",
    "company_id": "comp_elyasr",
    "user_email": "cselyasrsukses@gmail.com",
    "employee_id": "EL-EM-04",
    "full_name": "Desil",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "KARYAWAN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 0,
    "cuti_sakit": 0,
    "base_salary": 1000000,
    "tunjangan_kesehatan": 75000,
    "uang_kehadiran": 40000,
    "uang_transport": 10000,
    "uang_makan": 0,
    "created_at": "2026-01-21"
  },
  {
    "id": "69705ccf821338a5238bf548",
    "company_id": "comp_elyasr",
    "user_email": "creativeelyasrnew@gmail.com",
    "employee_id": "EL-EM-03",
    "full_name": "Mawar",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "KARYAWAN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 0,
    "cuti_sakit": 0,
    "base_salary": 1100000,
    "tunjangan_kesehatan": 75000,
    "uang_kehadiran": 30000,
    "uang_transport": 15000,
    "uang_makan": 0,
    "created_at": "2026-01-21"
  },
  {
    "id": "69705cb9c87c315049a3d86a",
    "company_id": "comp_elyasr",
    "user_email": "annisanurafifahh@gmail.com",
    "employee_id": "EL-EM-02",
    "full_name": "Annisa",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "KARYAWAN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 20,
    "cuti_sakit": 12,
    "base_salary": 0,
    "tunjangan_kesehatan": 0,
    "uang_kehadiran": 0,
    "uang_transport": 0,
    "uang_makan": 0,
    "created_at": "2026-01-21"
  },
  {
    "id": "69705c978aaecd6d1b6098dd",
    "company_id": "comp_elyasr",
    "user_email": "financeelyasr@gmail.com",
    "employee_id": "EL-EM-01",
    "full_name": "Salma",
    "phone": "",
    "position": "",
    "department": "",
    "team_id": "team_elyasr",
    "role": "KARYAWAN",
    "join_date": "2026-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 0,
    "cuti_sakit": 0,
    "base_salary": 1300000,
    "tunjangan_kesehatan": 75000,
    "uang_kehadiran": 35000,
    "uang_transport": 10000,
    "uang_makan": 0,
    "created_at": "2026-01-21"
  },
  {
    "id": "69703ee3cdb0341809bba875",
    "company_id": "comp_elyasr",
    "user_email": "asfizaneva@gmail.com",
    "employee_id": "EMP001",
    "full_name": "Asfi Zaneva",
    "phone": "-",
    "position": "Owner",
    "department": "Management",
    "team_id": "team_elyasr",
    "role": "SUPER_ADMIN",
    "join_date": "2025-01-01",
    "photo_url": "",
    "is_active": true,
    "cuti_tahunan": 12,
    "cuti_sakit": 12,
    "base_salary": 0,
    "tunjangan_kesehatan": 0,
    "uang_kehadiran": 0,
    "uang_transport": 0,
    "uang_makan": 0,
    "created_at": "2026-01-21"
  }
];

export const teams: Team[] = [
  {
    "id": "team_elyasr",
    "company_id": "comp_elyasr",
    "name": "ELYASR Team",
    "manager_id": "emp_owner",
    "member_count": 7
  }
];

export const attendanceRecords: Attendance[] = [
  {
    "id": "69f93ec713c61911d03eb09d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-05-05",
    "check_in_time": "07:50",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887326856147325,
      "lng": 107.54650968320468
    },
    "check_out_location": {
      "lat": -6.887417074432528,
      "lng": 107.54647287492625
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f93f465f4c4cfb221d217a",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-05-05",
    "check_in_time": "07:52",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874539,
      "lng": 107.5465356
    },
    "check_out_location": {
      "lat": -6.8874544,
      "lng": 107.5465322
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f93e26322cc30c3a3b4877",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-05-05",
    "check_in_time": "07:47",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875168,
      "lng": 107.546526
    },
    "check_out_location": {
      "lat": -6.8874272,
      "lng": 107.5465309
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f93ec5d1e64974dd73fb01",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-05-05",
    "check_in_time": "07:50",
    "check_out_time": "17:09",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874534,
      "lng": 107.5465332
    },
    "check_out_location": {
      "lat": -6.8874849,
      "lng": 107.5465376
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f7ef9d977cd004029de677",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-05-04",
    "check_in_time": "08:00",
    "check_out_time": "17:36",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887377236895739,
      "lng": 107.54649352844439
    },
    "check_out_location": {
      "lat": -6.887417141769407,
      "lng": 107.5464655485407
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 21,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f7ef81d075356f84c6c84a",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-05-04",
    "check_in_time": "07:59",
    "check_out_time": "18:02",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874789,
      "lng": 107.5465308
    },
    "check_out_location": {
      "lat": -6.8874282,
      "lng": 107.5465347
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 47,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f7ef4703584b841569fb5f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-05-04",
    "check_in_time": "07:58",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874683,
      "lng": 107.5465442
    },
    "check_out_location": {
      "lat": -6.887517,
      "lng": 107.5465305
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f7ecaec3f79b6ed426abc8",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-05-04",
    "check_in_time": "07:47",
    "check_out_time": "17:45",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874558,
      "lng": 107.5465299
    },
    "check_out_location": {
      "lat": -6.8874553,
      "lng": 107.5465359
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 30,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f54b08572fd3c135c8785b",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-05-02",
    "check_in_time": "07:53",
    "check_out_time": "15:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874593,
      "lng": 107.5465277
    },
    "check_out_location": {
      "lat": -6.8874498,
      "lng": 107.5465337
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f54a903bd46940e3b1411b",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-05-02",
    "check_in_time": "07:51",
    "check_out_time": "15:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887604,
      "lng": 107.5466051
    },
    "check_out_location": {
      "lat": -6.8874512,
      "lng": 107.5465322
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f5498b86f1b7644b8a6ef2",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-05-02",
    "check_in_time": "07:47",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874218,
      "lng": 107.5465201
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f5473acbcb87eb58b876eb",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-05-02",
    "check_in_time": "07:37",
    "check_out_time": "15:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887371769009702,
      "lng": 107.54650642947242
    },
    "check_out_location": {
      "lat": -6.887449830269458,
      "lng": 107.54645755491937
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 6,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f3f6dafc455cd9cce656f4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-05-01",
    "check_in_time": "07:42",
    "check_out_time": "13:20",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874934,
      "lng": 107.5465345
    },
    "check_out_location": {
      "lat": -6.8873336,
      "lng": 107.5464149
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f3f3e344d80321e2f466d0",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-05-01",
    "check_in_time": "07:29",
    "check_out_time": "15:38",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887411208883978,
      "lng": 107.54650839741865
    },
    "check_out_location": {
      "lat": -6.887320104743939,
      "lng": 107.54653804785087
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 23,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f3f9b71507f1f921897d1d",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-05-01",
    "check_in_time": "07:54",
    "check_out_time": "15:33",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874558,
      "lng": 107.5465389
    },
    "check_out_location": {
      "lat": -6.8874236,
      "lng": 107.5465078
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 18,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f3f9e314fffc8b4d9fca61",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-05-01",
    "check_in_time": "07:54",
    "check_out_time": "13:20",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874541,
      "lng": 107.5465357
    },
    "check_out_location": {
      "lat": -6.8873684,
      "lng": 107.5464551
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f2a7d90e3570f3d4248de5",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-30",
    "check_in_time": "07:52",
    "check_out_time": "17:46",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887493,
      "lng": 107.5465359
    },
    "check_out_location": {
      "lat": -6.8874417,
      "lng": 107.5465008
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 31,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f2a6c47fa334d40cd7e390",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-30",
    "check_in_time": "07:48",
    "check_out_time": "18:02",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887443,
      "lng": 107.5465339
    },
    "check_out_location": {
      "lat": -6.8874537,
      "lng": 107.5465369
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 47,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f2a6b7061b884760189c86",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-30",
    "check_in_time": "07:47",
    "check_out_time": "17:42",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887411208883978,
      "lng": 107.54650839741865
    },
    "check_out_location": {
      "lat": -6.887452974172919,
      "lng": 107.5465215086114
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 27,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f2a5d5182980f9e4a1b9b4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-30",
    "check_in_time": "07:44",
    "check_out_time": "17:44",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874489,
      "lng": 107.546521
    },
    "check_out_location": {
      "lat": -6.8874519,
      "lng": 107.5465354
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 29,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f1570b644a2a51aef4a009",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-29",
    "check_in_time": "07:55",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874816,
      "lng": 107.5465559
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f1547a16fc4ccbd15bb9c0",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-29",
    "check_in_time": "07:44",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887327169999569,
      "lng": 107.54649994605707
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f1546bd1b1822b734d9543",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-29",
    "check_in_time": "07:44",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875319,
      "lng": 107.5465368
    },
    "check_out_location": {
      "lat": -6.8874406,
      "lng": 107.5465303
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f00481afb39baf3c3a4387",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-28",
    "check_in_time": "07:51",
    "check_out_time": "17:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887315,
      "lng": 107.5462464
    },
    "check_out_location": {
      "lat": -6.8874679,
      "lng": 107.5465459
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 6,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f0041279cf82fc24ea0b61",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-28",
    "check_in_time": "07:49",
    "check_out_time": "17:19",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874637,
      "lng": 107.5465439
    },
    "check_out_location": {
      "lat": -6.8874489,
      "lng": 107.5465407
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 4,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f002cd1c7ceb455ac2b79e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-28",
    "check_in_time": "07:43",
    "check_out_time": "17:27",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874783,
      "lng": 107.5465567
    },
    "check_out_location": {
      "lat": -6.88731,
      "lng": 107.5463909
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 12,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eeb18fbe4aafbadcece099",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-27",
    "check_in_time": "07:45",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875914,
      "lng": 107.5465526
    },
    "check_out_location": {
      "lat": -6.887584,
      "lng": 107.5465506
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eeb2f22b935f062df358af",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-27",
    "check_in_time": "07:50",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.88759,
      "lng": 107.5465375
    },
    "check_out_location": {
      "lat": -6.8874524,
      "lng": 107.5465408
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eeb316ab2f6b7a9e95db0f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-27",
    "check_in_time": "07:51",
    "check_out_time": "17:27",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874533,
      "lng": 107.5464826
    },
    "check_out_location": {
      "lat": -6.8874424,
      "lng": 107.5465475
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 12,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eeb33255aa91fbe92da7c3",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-27",
    "check_in_time": "07:52",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887411208883978,
      "lng": 107.54650839741865
    },
    "check_out_location": {
      "lat": -6.88739949898689,
      "lng": 107.54648644375006
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ec80faa53d5c584aa7d366",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-25",
    "check_in_time": "15:53",
    "check_out_time": "15:53",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874305581833415,
      "lng": 107.54650472001931
    },
    "check_out_location": {
      "lat": -6.887430509451865,
      "lng": 107.5465047265111
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 38,
    "late_minutes": 473,
    "early_leave_minutes": 0
  },
  {
    "id": "69ec17f8354583d538954300",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-25",
    "check_in_time": "08:25",
    "check_out_time": "16:30",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874435,
      "lng": 107.5465369
    },
    "check_out_location": {
      "lat": -6.8874456,
      "lng": 107.5465385
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 75,
    "late_minutes": 25,
    "early_leave_minutes": 0
  },
  {
    "id": "69ec0efaa1e03a7a81932d48",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-25",
    "check_in_time": "07:46",
    "check_out_time": "15:53",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874553,
      "lng": 107.5465419
    },
    "check_out_location": {
      "lat": -6.8874517,
      "lng": 107.5465386
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 38,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eabd1d3c10ee9f0a34c7e0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-24",
    "check_in_time": "07:45",
    "check_out_time": "17:14",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875721,
      "lng": 107.546554
    },
    "check_out_location": {
      "lat": -6.8875189,
      "lng": 107.5465548
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eabde9f91ca8d5080fb15d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-24",
    "check_in_time": "07:48",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_out_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69eabd46cecc74d0aeda6113",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-24",
    "check_in_time": "07:45",
    "check_out_time": "17:12",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874409,
      "lng": 107.5465316
    },
    "check_out_location": {
      "lat": -6.8874525,
      "lng": 107.5465402
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e96ce1f75b8bfd053f9d89",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-23",
    "check_in_time": "07:50",
    "check_out_time": "17:11",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874778,
      "lng": 107.5465424
    },
    "check_out_location": {
      "lat": -6.887447,
      "lng": 107.5465388
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e96bb33757006353284eee",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-23",
    "check_in_time": "07:45",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874866,
      "lng": 107.5465649
    },
    "check_out_location": {
      "lat": -6.8873894,
      "lng": 107.5465127
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e96b73b5a31e1457a36340",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-23",
    "check_in_time": "07:44",
    "check_out_time": "17:08",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_out_location": {
      "lat": -6.887473061069541,
      "lng": 107.54648575919421
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e81d14ab38b12dd1bff8cd",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-22",
    "check_in_time": "07:57",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887509,
      "lng": 107.5465466
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e81cd6db82ded83fbb2b88",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-22",
    "check_in_time": "07:56",
    "check_out_time": "17:35",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874647,
      "lng": 107.5465422
    },
    "check_out_location": {
      "lat": -6.8874905,
      "lng": 107.5465397
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 20,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e81c80e5f1167b8c4fbebb",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-22",
    "check_in_time": "07:55",
    "check_out_time": "17:31",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_out_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 16,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e81a9e197d59b53a28bec0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-22",
    "check_in_time": "07:47",
    "check_out_time": "17:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887566,
      "lng": 107.5465281
    },
    "check_out_location": {
      "lat": -6.8875598,
      "lng": 107.546546
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e6c8b6c97ebd946315d1c3",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-21",
    "check_in_time": "07:45",
    "check_out_time": "17:26",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874581,
      "lng": 107.546543
    },
    "check_out_location": {
      "lat": -6.8874456,
      "lng": 107.5465372
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 11,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e6c8e3c01ec2bf115ac24c",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-21",
    "check_in_time": "07:46",
    "check_out_time": "17:22",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887407289831495,
      "lng": 107.54651389896506
    },
    "check_out_location": {
      "lat": -6.887433892539637,
      "lng": 107.54648780253517
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e6c8f62689bb32dcb62f2c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-21",
    "check_in_time": "07:46",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875669,
      "lng": 107.5465592
    },
    "check_out_location": {
      "lat": -6.8874346,
      "lng": 107.5465262
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e6c90c4ae2ba1056523288",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-21",
    "check_in_time": "07:47",
    "check_out_time": "17:20",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874554,
      "lng": 107.5465413
    },
    "check_out_location": {
      "lat": -6.8874182,
      "lng": 107.5465359
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 5,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e57995d45bff2a994f514d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-20",
    "check_in_time": "07:55",
    "check_out_time": "17:18",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887394179955106,
      "lng": 107.54645727991252
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 3,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e5793bd3a7f5650115eca1",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-20",
    "check_in_time": "07:54",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874226,
      "lng": 107.5464979
    },
    "check_out_location": {
      "lat": -6.8875403,
      "lng": 107.5465485
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e5789de8389bc52be7ced3",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-20",
    "check_in_time": "07:51",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873016,
      "lng": 107.5464178
    },
    "check_out_location": {
      "lat": -6.8874608,
      "lng": 107.5465442
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e5789443413fcd57629df2",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-20",
    "check_in_time": "07:51",
    "check_out_time": "17:22",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874683,
      "lng": 107.5465399
    },
    "check_out_location": {
      "lat": -6.8874502,
      "lng": 107.5465413
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f4611360f8a6cd479921d3",
    "company_id": "comp_elyasr",
    "employee_id": "69cc9ba87030f27d5b9bd839",
    "date": "2026-04-18",
    "check_in_time": "08:00",
    "check_out_time": "17:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Acara kantor - diinput manual oleh admin",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f4611360f8a6cd479921d6",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-18",
    "check_in_time": "08:00",
    "check_out_time": "17:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Acara kantor - diinput manual oleh admin",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f4611360f8a6cd479921d5",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-18",
    "check_in_time": "08:00",
    "check_out_time": "17:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Acara kantor - diinput manual oleh admin",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f4611360f8a6cd479921d7",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-18",
    "check_in_time": "08:00",
    "check_out_time": "17:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Acara kantor - diinput manual oleh admin",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69f4611360f8a6cd479921d4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-18",
    "check_in_time": "08:00",
    "check_out_time": "17:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Acara kantor - diinput manual oleh admin",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e184f194b729568e833de1",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-17",
    "check_in_time": "07:55",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875256,
      "lng": 107.546555
    },
    "check_out_location": {
      "lat": -6.887449,
      "lng": 107.546535
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e184be6b1b8b71293aa697",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-17",
    "check_in_time": "07:54",
    "check_out_time": "17:09",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874019,
      "lng": 107.5465045
    },
    "check_out_location": {
      "lat": -6.8876024,
      "lng": 107.5465531
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e1842622f35ecbe2014104",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-17",
    "check_in_time": "07:51",
    "check_out_time": "17:16",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887455,
      "lng": 107.5465428
    },
    "check_out_location": {
      "lat": -6.8874575,
      "lng": 107.5465403
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 1,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e1801da7fd602b27b45298",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-17",
    "check_in_time": "07:34",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887395156710308,
      "lng": 107.54648059889098
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e030ae14c46b07e945eebd",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-16",
    "check_in_time": "07:43",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874954,
      "lng": 107.5465107
    },
    "check_out_location": {
      "lat": -6.8873349,
      "lng": 107.5464051
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e032569592a84ce5eee19e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-16",
    "check_in_time": "07:50",
    "check_out_time": "17:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8876114,
      "lng": 107.5465521
    },
    "check_out_location": {
      "lat": -6.8874572,
      "lng": 107.5465419
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e03372f2c07e1af3f43971",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-16",
    "check_in_time": "07:55",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874711,
      "lng": 107.5465454
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69e03413e6c1bd017640777e",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-16",
    "check_in_time": "07:57",
    "check_out_time": "17:11",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_out_location": {
      "lat": -6.887427931385422,
      "lng": 107.5465005447182
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69df11ab36bbe029574dd444",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-15",
    "check_in_time": "11:18",
    "check_out_time": "17:37",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874588,
      "lng": 107.5465434
    },
    "check_out_location": {
      "lat": -6.8872787,
      "lng": 107.5464216
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 22,
    "late_minutes": 198,
    "early_leave_minutes": 0
  },
  {
    "id": "69dee356ef9a8bd7b6e28bbc",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-15",
    "check_in_time": "08:01",
    "check_out_time": "17:35",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874583,
      "lng": 107.5465385
    },
    "check_out_location": {
      "lat": -6.8875807,
      "lng": 107.5465481
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 20,
    "late_minutes": 1,
    "early_leave_minutes": 0
  },
  {
    "id": "69dee1341cf99a306f56ab7a",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-15",
    "check_in_time": "07:52",
    "check_out_time": "17:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69dee1210f5f46a246da5aaf",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-15",
    "check_in_time": "07:51",
    "check_out_time": "17:33",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875939,
      "lng": 107.5465449
    },
    "check_out_location": {
      "lat": -6.8874592,
      "lng": 107.5465429
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 18,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ddb20b49f692d5ffd01c0e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-14",
    "check_in_time": "10:18",
    "check_out_time": "19:26",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875737,
      "lng": 107.5465441
    },
    "check_out_location": {
      "lat": -6.8874629,
      "lng": 107.5465448
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 131,
    "late_minutes": 138,
    "early_leave_minutes": 0
  },
  {
    "id": "69ddb1f44808e8888066e556",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-14",
    "check_in_time": "10:18",
    "check_out_time": "19:25",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874451,
      "lng": 107.5465457
    },
    "check_out_location": {
      "lat": -6.887535,
      "lng": 107.5465524
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 130,
    "late_minutes": 138,
    "early_leave_minutes": 0
  },
  {
    "id": "69dd8f6633456a0e4fad78a3",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-14",
    "check_in_time": "07:50",
    "check_out_time": "17:20",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874364,
      "lng": 107.5465341
    },
    "check_out_location": {
      "lat": -6.8875839,
      "lng": 107.5465562
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 5,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69dd8f5bf174ef4c1f535d78",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-14",
    "check_in_time": "07:50",
    "check_out_time": "17:04",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69dc4ec3be5a829f9f1601a5",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-13",
    "check_in_time": "09:02",
    "check_out_time": "17:34",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874386,
      "lng": 107.5465317
    },
    "check_out_location": {
      "lat": -6.8874589,
      "lng": 107.5465481
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 19,
    "late_minutes": 62,
    "early_leave_minutes": 0
  },
  {
    "id": "69dc3daf9eee6d7b5a9c7f38",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-13",
    "check_in_time": "07:49",
    "check_out_time": "17:35",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874288,
      "lng": 107.5465348
    },
    "check_out_location": {
      "lat": -6.8873089,
      "lng": 107.5464473
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 20,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69dc3ece08438e877fb1b55f",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-13",
    "check_in_time": "07:54",
    "check_out_time": "17:28",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873505973016735,
      "lng": 107.54648126204056
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 13,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69dc3df438d14d4b282e0cb9",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-13",
    "check_in_time": "07:50",
    "check_out_time": "17:30",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874734,
      "lng": 107.5465434
    },
    "check_out_location": {
      "lat": -6.887533,
      "lng": 107.5465445
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 15,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d99dc6a130d47f1c8841a5",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-11",
    "check_in_time": "08:03",
    "check_out_time": "16:12",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874813,
      "lng": 107.5465448
    },
    "check_out_location": {
      "lat": -6.8874427,
      "lng": 107.5465389
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 57,
    "late_minutes": 3,
    "early_leave_minutes": 0
  },
  {
    "id": "69d99c79a9a777b2a4a20482",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-11",
    "check_in_time": "07:57",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874533,
      "lng": 107.546547
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d99b275551ef163b8bc7f4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-11",
    "check_in_time": "07:51",
    "check_out_time": "15:28",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874659,
      "lng": 107.5465432
    },
    "check_out_location": {
      "lat": -6.8874559,
      "lng": 107.5465403
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 13,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d99a20fbfd6992f655ebfc",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-11",
    "check_in_time": "07:47",
    "check_out_time": "15:22",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d84a26fb8e8ab72f080b0a",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-10",
    "check_in_time": "07:53",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874711,
      "lng": 107.5465484
    },
    "check_out_location": {
      "lat": -6.8872324,
      "lng": 107.5465657
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d84a1faebc664c6924a2c5",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-10",
    "check_in_time": "07:53",
    "check_out_time": "17:20",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874527,
      "lng": 107.5465469
    },
    "check_out_location": {
      "lat": -6.887411,
      "lng": 107.5465394
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 5,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d849f5be0b2da9610148cc",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-10",
    "check_in_time": "07:53",
    "check_out_time": "17:18",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 3,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d8465edb66ccf247cb7265",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-10",
    "check_in_time": "07:37",
    "check_out_time": "17:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874556,
      "lng": 107.5465421
    },
    "check_out_location": {
      "lat": -6.8873147,
      "lng": 107.5464292
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d6fa11fad2ac484be994ad",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-09",
    "check_in_time": "08:00",
    "check_out_time": "17:07",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874483,
      "lng": 107.5465416
    },
    "check_out_location": {
      "lat": -6.8874939,
      "lng": 107.5465496
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d6f950df87bbae82bed220",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-09",
    "check_in_time": "07:56",
    "check_out_time": "17:07",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887349642479923,
      "lng": 107.54650518819585
    },
    "check_out_location": {
      "lat": -6.887397113487206,
      "lng": 107.54651402298997
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d6f78c4698e50d31d3a7eb",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-09",
    "check_in_time": "07:49",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874455,
      "lng": 107.5465665
    },
    "check_out_location": {
      "lat": -6.8876169,
      "lng": 107.5465615
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d6f6974001577c73acaf0f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-09",
    "check_in_time": "07:45",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874209,
      "lng": 107.5464635
    },
    "check_out_location": {
      "lat": -6.887522,
      "lng": 107.5465426
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d5a477fdc0c122e4f96063",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-08",
    "check_in_time": "07:42",
    "check_out_time": "11:40",
    "status": "PULANG_CEPAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875003,
      "lng": 107.5463688
    },
    "check_out_location": {
      "lat": -6.8875541,
      "lng": 107.546558
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 319
  },
  {
    "id": "69d5a6ff1b30f39d3f8684ef",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-08",
    "check_in_time": "07:53",
    "check_out_time": "17:17",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875507,
      "lng": 107.5465473
    },
    "check_out_location": {
      "lat": -6.8875463,
      "lng": 107.5465465
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 2,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d5a7a2ff3074593de87359",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-08",
    "check_in_time": "07:56",
    "check_out_time": "17:06",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_out_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d5a7b9660ebd6e0740b349",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-08",
    "check_in_time": "07:56",
    "check_out_time": "17:17",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8872718,
      "lng": 107.5464448
    },
    "check_out_location": {
      "lat": -6.8874466,
      "lng": 107.5465435
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 2,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d4571bb266a97ceeab4888",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-07",
    "check_in_time": "08:00",
    "check_out_time": "18:12",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874434,
      "lng": 107.5465437
    },
    "check_out_location": {
      "lat": -6.887432,
      "lng": 107.5465404
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 57,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d45622d50f12fe0f4689f5",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-07",
    "check_in_time": "07:56",
    "check_out_time": "18:01",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887462257011698,
      "lng": 107.54647601424206
    },
    "check_out_location": {
      "lat": -6.887438025724256,
      "lng": 107.54649516624902
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 46,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d454b115746c7f723f060c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-07",
    "check_in_time": "07:49",
    "check_out_time": "18:52",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874401,
      "lng": 107.5465603
    },
    "check_out_location": {
      "lat": -6.8875404,
      "lng": 107.5465417
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 97,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d45301951b37b9cf22e292",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-07",
    "check_in_time": "07:42",
    "check_out_time": "18:09",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874149,
      "lng": 107.5465421
    },
    "check_out_location": {
      "lat": -6.8874504,
      "lng": 107.5465453
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 54,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d309a706e06118dd763e2e",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-06",
    "check_in_time": "08:17",
    "check_out_time": "18:03",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874437,
      "lng": 107.5465464
    },
    "check_out_location": {
      "lat": -6.8874277,
      "lng": 107.546541
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 48,
    "late_minutes": 17,
    "early_leave_minutes": 0
  },
  {
    "id": "69d303fc6bba2a085b90ef18",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-06",
    "check_in_time": "07:53",
    "check_out_time": "17:39",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_out_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 24,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d303bea1c40eaaf7662445",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-06",
    "check_in_time": "07:52",
    "check_out_time": "17:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873201,
      "lng": 107.546493
    },
    "check_out_location": {
      "lat": -6.8874104,
      "lng": 107.5465394
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 14,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d302f4665b88672caa1c45",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-06",
    "check_in_time": "07:48",
    "check_out_time": "17:40",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874385,
      "lng": 107.546542
    },
    "check_out_location": {
      "lat": -6.8875468,
      "lng": 107.5465485
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 25,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d061a2cd41d9e70f052df8",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-04",
    "check_in_time": "07:56",
    "check_out_time": "15:41",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887549,
      "lng": 107.5465378
    },
    "check_out_location": {
      "lat": -6.8874546,
      "lng": 107.5465498
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 26,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d060a665fed0ba10d6fd11",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-04",
    "check_in_time": "07:51",
    "check_out_time": "15:37",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8875336,
      "lng": 107.5465511
    },
    "check_out_location": {
      "lat": -6.8874366,
      "lng": 107.5465624
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 22,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69d05ca143ad682c818dca85",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-04",
    "check_in_time": "07:34",
    "check_out_time": "15:39",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874846,
      "lng": 107.546544
    },
    "check_out_location": {
      "lat": -6.8875137,
      "lng": 107.5465588
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 24,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cf113a4f3ec65e8f958f33",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-03",
    "check_in_time": "08:00",
    "check_out_time": "15:04",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887472,
      "lng": 107.5465579
    },
    "check_out_location": {
      "lat": -6.887551,
      "lng": 107.5465482
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cf1048e22a649c355845b0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-03",
    "check_in_time": "07:56",
    "check_out_time": "15:26",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874522,
      "lng": 107.5465607
    },
    "check_out_location": {
      "lat": -6.8875365,
      "lng": 107.5465367
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cf101d5051b42496ba42e1",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-03",
    "check_in_time": "07:55",
    "check_out_time": "15:11",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_out_location": {
      "lat": -6.887406105018644,
      "lng": 107.54643871228444
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cf0ddd368a5b5998f0433e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-03",
    "check_in_time": "07:46",
    "check_out_time": "15:26",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874883,
      "lng": 107.5465391
    },
    "check_out_location": {
      "lat": -6.887566,
      "lng": 107.5465496
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cdbb701064124d94f5b7c1",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-02",
    "check_in_time": "07:42",
    "check_out_time": "17:14",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_out_location": {
      "lat": -6.887393185074995,
      "lng": 107.54651576264324
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cdbe9b9a55daaae9b5afb1",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-02",
    "check_in_time": "07:55",
    "check_out_time": "17:18",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887461,
      "lng": 107.5464069
    },
    "check_out_location": {
      "lat": -6.8874546,
      "lng": 107.5465657
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 3,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cdbd975547898846cd4139",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-02",
    "check_in_time": "07:51",
    "check_out_time": "17:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874299,
      "lng": 107.546541
    },
    "check_out_location": {
      "lat": -6.8873949,
      "lng": 107.5465159
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 6,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cdbc68cc87167120e7c4a6",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-02",
    "check_in_time": "07:46",
    "check_out_time": "17:17",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874235,
      "lng": 107.5465654
    },
    "check_out_location": {
      "lat": -6.8874286,
      "lng": 107.5465571
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 2,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cc6c9945ddfa47c228dc5f",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-04-01",
    "check_in_time": "07:53",
    "check_out_time": "17:31",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874395,
      "lng": 107.546565
    },
    "check_out_location": {
      "lat": -6.8874298,
      "lng": 107.5465592
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 16,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cc6bbd83203fb19f91b696",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-04-01",
    "check_in_time": "07:50",
    "check_out_time": "17:31",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874537,
      "lng": 107.5465479
    },
    "check_out_location": {
      "lat": -6.8873856,
      "lng": 107.5465565
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 16,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cc6b9c3896bec0471e9baa",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-04-01",
    "check_in_time": "07:49",
    "check_out_time": "17:12",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.88739156907644,
      "lng": 107.54651475143986
    },
    "check_out_location": {
      "lat": -6.88739156907644,
      "lng": 107.54651475143986
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cc6b1bf1706f174015ee5e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-04-01",
    "check_in_time": "07:47",
    "check_out_time": "17:19",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874507,
      "lng": 107.5464133
    },
    "check_out_location": {
      "lat": -6.8874502,
      "lng": 107.5465678
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 4,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cb1c131302b9a83e953259",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-31",
    "check_in_time": "07:57",
    "check_out_time": "17:14",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874349,
      "lng": 107.5465633
    },
    "check_out_location": {
      "lat": -6.8874235,
      "lng": 107.5465598
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cb1bd10c650e55456bc983",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-31",
    "check_in_time": "07:56",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887272485350411,
      "lng": 107.54654346112964
    },
    "check_out_location": {
      "lat": -6.88739156907644,
      "lng": 107.54651475143986
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cb19af2031b0aadeb19744",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-31",
    "check_in_time": "07:47",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887448,
      "lng": 107.5465633
    },
    "check_out_location": {
      "lat": -6.8874401,
      "lng": 107.5465621
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69cb185f92a4457308ed4b4c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-31",
    "check_in_time": "07:42",
    "check_out_time": "17:14",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874289,
      "lng": 107.5465539
    },
    "check_out_location": {
      "lat": -6.8874508,
      "lng": 107.5465655
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69c9ca982af83325079ce6c5",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-30",
    "check_in_time": "07:57",
    "check_out_time": "18:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874462,
      "lng": 107.5465691
    },
    "check_out_location": {
      "lat": -6.8874189,
      "lng": 107.5465598
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 66,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69c9c888ff779ff3e6e51210",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-30",
    "check_in_time": "07:49",
    "check_out_time": "18:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874093,
      "lng": 107.5465668
    },
    "check_out_location": {
      "lat": -6.8874103,
      "lng": 107.5465619
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 66,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69c9c766e7023c5d32703c17",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-30",
    "check_in_time": "07:44",
    "check_out_time": "18:23",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874753,
      "lng": 107.5465611
    },
    "check_out_location": {
      "lat": -6.8874374,
      "lng": 107.5465638
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 68,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69c9c6075d7fc1429c6020c3",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-30",
    "check_in_time": "07:38",
    "check_out_time": "17:35",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.88739156907644,
      "lng": 107.54651475143986
    },
    "check_out_location": {
      "lat": -6.88739156907644,
      "lng": 107.54651475143986
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 20,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b8a5f9d9013aab2ff6e94d",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-17",
    "check_in_time": "07:53",
    "check_out_time": "17:15",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874453,
      "lng": 107.5465574
    },
    "check_out_location": {
      "lat": -6.8874895,
      "lng": 107.5465593
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b8a58f852ce61e5014b53f",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-17",
    "check_in_time": "07:51",
    "check_out_time": "17:08",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887392395005936,
      "lng": 107.54651436149109
    },
    "check_out_location": {
      "lat": -6.887392395005936,
      "lng": 107.54651436149109
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b8a649bb7542331f33166f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-17",
    "check_in_time": "07:54",
    "check_out_time": "17:07",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874393,
      "lng": 107.5465489
    },
    "check_out_location": {
      "lat": -6.887447,
      "lng": 107.5465482
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b8aedb60b951aba784a020",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-17",
    "check_in_time": "08:31",
    "check_out_time": "17:15",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874039,
      "lng": 107.5465698
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 31,
    "early_leave_minutes": 0
  },
  {
    "id": "69b755fe55bef37c3a6f24c1",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-16",
    "check_in_time": "07:59",
    "check_out_time": "17:40",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874361,
      "lng": 107.5465604
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 25,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b755029aa66942112b6f44",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-16",
    "check_in_time": "07:55",
    "check_out_time": "17:41",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874754,
      "lng": 107.5464639
    },
    "check_out_location": {
      "lat": -6.8874186,
      "lng": 107.546547
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 26,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b7544fec67912f31b9f886",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-16",
    "check_in_time": "07:52",
    "check_out_time": "17:41",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874391,
      "lng": 107.5465496
    },
    "check_out_location": {
      "lat": -6.8874096,
      "lng": 107.5465478
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 26,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b75291acae82f475222fe6",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-16",
    "check_in_time": "07:45",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.887391771811827,
      "lng": 107.54651460514067
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b4b28beaf6bd583ba7adc7",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-14",
    "check_in_time": "07:57",
    "check_out_time": "17:27",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874569120347395,
      "lng": 107.5464962565527
    },
    "check_out_location": {
      "lat": -6.887384780325264,
      "lng": 107.54651684484428
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 132,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b4b178df1fc45c3ab10480",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-14",
    "check_in_time": "07:53",
    "check_out_time": "20:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874076,
      "lng": 107.5465413
    },
    "check_out_location": {
      "lat": -6.8874954,
      "lng": 107.5465428
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b4b168c95948f3f24dfb5c",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-14",
    "check_in_time": "07:52",
    "check_out_time": "20:38",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874385,
      "lng": 107.546565
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b4b0f6d59e577529afaaa8",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-14",
    "check_in_time": "07:51",
    "check_out_time": "20:37",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874378,
      "lng": 107.5465538
    },
    "check_out_location": {
      "lat": -6.8874486,
      "lng": 107.5465541
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b3616bf6d5227cd6c0c701",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-13",
    "check_in_time": "07:59",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874785,
      "lng": 107.546554
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b360b5091f124b4a41d6a7",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-13",
    "check_in_time": "07:56",
    "check_out_time": "19:52",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874709,
      "lng": 107.5465606
    },
    "check_out_location": {
      "lat": -6.8874881,
      "lng": 107.5465579
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 157,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b36078cc2299b9db7b2f98",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-13",
    "check_in_time": "07:55",
    "check_out_time": "20:08",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874553,
      "lng": 107.5465397
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 173,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b3604835618aba752dee67",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-13",
    "check_in_time": "07:54",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887375584469327,
      "lng": 107.54652740163935
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b20e5c31ca07676c70e75c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-12",
    "check_in_time": "07:52",
    "check_out_time": "17:36",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874471,
      "lng": 107.5465429
    },
    "check_out_location": {
      "lat": -6.8874875,
      "lng": 107.5465457
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 21,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b20f24bc258fd73edbec1e",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-12",
    "check_in_time": "07:56",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887434,
      "lng": 107.54654
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b211b084fa18e9c48e806f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-12",
    "check_in_time": "08:06",
    "check_out_time": "17:34",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874278,
      "lng": 107.5465551
    },
    "check_out_location": {
      "lat": -6.8874925,
      "lng": 107.5465489
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 19,
    "late_minutes": 6,
    "early_leave_minutes": 0
  },
  {
    "id": "69b20f2ca4f144aa1121820b",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-12",
    "check_in_time": "07:56",
    "check_out_time": "17:25",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873805411996,
      "lng": 107.54652191814033
    },
    "check_out_location": {
      "lat": -6.8873805411996,
      "lng": 107.54652191814033
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 10,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b0be63a7b4b8ef04643da7",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-11",
    "check_in_time": "07:59",
    "check_out_time": "19:40",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887463,
      "lng": 107.5465514
    },
    "check_out_location": {
      "lat": -6.8874125,
      "lng": 107.5465497
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 145,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b0bce7b6d248a0fc5c8a9d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-11",
    "check_in_time": "07:52",
    "check_out_time": "18:41",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887384041688579,
      "lng": 107.54652906183237
    },
    "check_out_location": {
      "lat": -6.887379620005988,
      "lng": 107.54651896952068
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 86,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b0bbf12f40f9f6036f78cb",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-11",
    "check_in_time": "07:48",
    "check_out_time": "19:40",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874957,
      "lng": 107.5465404
    },
    "check_out_location": {
      "lat": -6.8874268,
      "lng": 107.5465619
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 145,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69b0bb8bf1e6c0cf63a3be5e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-11",
    "check_in_time": "07:47",
    "check_out_time": "19:37",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874689,
      "lng": 107.5465502
    },
    "check_out_location": {
      "lat": -6.8875007,
      "lng": 107.5465332
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 142,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69af69d0047bcf1410f9b78e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-10",
    "check_in_time": "07:46",
    "check_out_time": "21:19",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.88745,
      "lng": 107.5465539
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69af6bf4b0bfd16317884426",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-10",
    "check_in_time": "07:55",
    "check_out_time": "20:28",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873996,
      "lng": 107.5463531
    },
    "check_out_location": {
      "lat": -6.8874234,
      "lng": 107.5465353
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69af6bf6da35a5dc1f1030b5",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-10",
    "check_in_time": "07:55",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874921,
      "lng": 107.5465533
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69af6cfd043af1f85a020423",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-10",
    "check_in_time": "07:59",
    "check_out_time": "20:07",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887467891149985,
      "lng": 107.54648988267857
    },
    "check_out_location": {
      "lat": -6.887379620005988,
      "lng": 107.54651896952068
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 172,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ae273d6fb57247e69e92fa",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-09",
    "check_in_time": "08:49",
    "check_out_time": "21:03",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887434,
      "lng": 107.5465515
    },
    "check_out_location": {
      "lat": -6.8874177,
      "lng": 107.5465484
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 49,
    "early_leave_minutes": 0
  },
  {
    "id": "69ae273b843e317e0f0d5631",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-09",
    "check_in_time": "08:49",
    "check_out_time": "21:07",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874403,
      "lng": 107.5465454
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 49,
    "early_leave_minutes": 0
  },
  {
    "id": "69ae1b41351ecad741c203cc",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-09",
    "check_in_time": "07:58",
    "check_out_time": "19:29",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874161,
      "lng": 107.5465504
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 134,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ab79310bf91c121ffe7857",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-07",
    "check_in_time": "08:02",
    "check_out_time": "17:38",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874179,
      "lng": 107.546544
    },
    "check_out_location": {
      "lat": -6.8874141,
      "lng": 107.5465495
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 143,
    "late_minutes": 2,
    "early_leave_minutes": 0
  },
  {
    "id": "69ab76ca7a29cf4f228b5ab3",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-07",
    "check_in_time": "07:52",
    "check_out_time": "17:21",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.88737869821452,
      "lng": 107.54651933943289
    },
    "check_out_location": {
      "lat": -6.88737869821452,
      "lng": 107.54651933943289
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 126,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ab7675ab9cb87eb7514fe1",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-07",
    "check_in_time": "07:51",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874939,
      "lng": 107.5465507
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69ab7655c2093e2c554761ad",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-07",
    "check_in_time": "07:50",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874772,
      "lng": 107.5465559
    },
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69aa265c150017622c7f893d",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-06",
    "check_in_time": "07:56",
    "check_out_time": "21:06",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887484,
      "lng": 107.5465557
    },
    "check_out_location": {
      "lat": -6.8874839,
      "lng": 107.5464271
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69aa24c301039be80ceacce4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-06",
    "check_in_time": "07:50",
    "check_out_time": "21:06",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874743,
      "lng": 107.5465403
    },
    "check_out_location": {
      "lat": -6.887502,
      "lng": 107.5465505
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69aa25967b4feddf46d5625f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-06",
    "check_in_time": "07:53",
    "check_out_time": "19:43",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874242,
      "lng": 107.5465393
    },
    "check_out_location": {
      "lat": -6.8874242,
      "lng": 107.5465484
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 148,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69aa26219b6c678a5a3fe38d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-06",
    "check_in_time": "07:56",
    "check_out_time": "19:13",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887383166037361,
      "lng": 107.54647526471402
    },
    "check_out_location": {
      "lat": -6.8873774123942555,
      "lng": 107.54651878170891
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 118,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a8d5b25721b055b63d60f0",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-05",
    "check_in_time": "08:00",
    "check_out_time": "19:41",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8873748414807086,
      "lng": 107.54651880054962
    },
    "check_out_location": {
      "lat": -6.8873774123942555,
      "lng": 107.54651878170891
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 146,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a8d543e57090949e7a166c",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-05",
    "check_in_time": "07:58",
    "check_out_time": "20:17",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874437,
      "lng": 107.5465611
    },
    "check_out_location": {
      "lat": -6.8874709,
      "lng": 107.5465537
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a8d2b95f3a7d24da237e6d",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-05",
    "check_in_time": "07:47",
    "check_out_time": "20:14",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874472,
      "lng": 107.5465348
    },
    "check_out_location": {
      "lat": -6.8874305,
      "lng": 107.5465587
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 179,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a8d25f6bcaebf049b41a66",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-05",
    "check_in_time": "07:46",
    "check_out_time": "19:53",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.887498,
      "lng": 107.5465464
    },
    "check_out_location": {
      "lat": -6.8873618,
      "lng": 107.5464151
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 158,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a784a6c3c9712e0cc5760c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-04",
    "check_in_time": "08:02",
    "check_out_time": "19:09",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874223,
      "lng": 107.5465188
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 114,
    "late_minutes": 2,
    "early_leave_minutes": 0
  },
  {
    "id": "69a7831d73b26a856adec6ac",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-04",
    "check_in_time": "07:55",
    "check_out_time": "18:55",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.887381706609735,
      "lng": 107.54650403005691
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 100,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a78152025425eb62e7293d",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-04",
    "check_in_time": "07:48",
    "check_out_time": "19:03",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874278,
      "lng": 107.5465585
    },
    "check_out_location": {
      "lat": -6.8874814,
      "lng": 107.5465458
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 108,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a633742d82c8689a4e9e53",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-03",
    "check_in_time": "08:03",
    "check_out_time": "21:04",
    "status": "TERLAMBAT",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8873905,
      "lng": 107.5463957
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 3,
    "early_leave_minutes": 0
  },
  {
    "id": "69a632700b9f250062fcac59",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-03",
    "check_in_time": "07:59",
    "check_out_time": "20:54",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874284,
      "lng": 107.546555
    },
    "check_out_location": {
      "lat": -6.8874202,
      "lng": 107.5465563
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a631da36ce3c957210f740",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-03",
    "check_in_time": "07:56",
    "check_out_time": "20:51",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.887373173630359,
      "lng": 107.54651702684181
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a63083b06a80413b64f8e5",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-03",
    "check_in_time": "07:51",
    "check_out_time": "20:58",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": {
      "lat": -6.8874969,
      "lng": 107.5465572
    },
    "check_out_location": {
      "lat": -6.8874834,
      "lng": 107.5465501
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a4dff8ed732e4ba23422e7",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-03-02",
    "check_in_time": "07:55",
    "check_out_time": "20:49",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874391,
      "lng": 107.5465593
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a4dfe8b99e19e521d04c74",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-03-02",
    "check_in_time": "07:55",
    "check_out_time": "20:35",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874236,
      "lng": 107.5465564
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a4dff34e1c845d98431658",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-03-02",
    "check_in_time": "07:55",
    "check_out_time": "20:49",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.8874279,
      "lng": 107.5465591
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a4e03e7c5844262e5d5989",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-03-02",
    "check_in_time": "07:56",
    "check_out_time": "20:34",
    "status": "HADIR",
    "check_in_method": "QR",
    "check_in_location": null,
    "check_out_location": {
      "lat": -6.887373173630359,
      "lng": 107.54651702684181
    },
    "check_in_photo_url": "",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 180,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699ba57302456d9da7a88d88",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-23",
    "check_in_time": "07:55",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874188,
      "lng": 107.5465524
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/cdcafed9a_Annisa-2026-02-23-07_55-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699ba5047b35ac69fbf2bf24",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-23",
    "check_in_time": "07:53",
    "check_out_time": "19:30",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887424,
      "lng": 107.5463992
    },
    "check_out_location": {
      "lat": -6.8874885,
      "lng": 107.5465533
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3c90f5282_Salma-2026-02-23-07_53-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 135,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699ba43fadfac300da43c3ac",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-23",
    "check_in_time": "07:50",
    "check_out_time": "19:32",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874717,
      "lng": 107.54656
    },
    "check_out_location": {
      "lat": -6.8874238,
      "lng": 107.5465591
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/f884b0459_Desil-2026-02-23-07_50-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 137,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699ba248fec3c7f74b98d310",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-23",
    "check_in_time": "07:41",
    "check_out_time": "18:42",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887366084393365,
      "lng": 107.5465146819032
    },
    "check_out_location": {
      "lat": -6.887366084393365,
      "lng": 107.5465146819032
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/846c204d9_Mawar-2026-02-23-07_41-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 87,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699901aecb78bbc06f860095",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-21",
    "check_in_time": "07:51",
    "check_out_time": "16:28",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874858,
      "lng": 107.5465592
    },
    "check_out_location": {
      "lat": -6.8874867,
      "lng": 107.546559
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3b8f855c3_Desil-2026-02-21-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 73,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699901937e9a3dbabdc330f0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-21",
    "check_in_time": "07:51",
    "check_out_time": "15:49",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874637,
      "lng": 107.5465291
    },
    "check_out_location": {
      "lat": -6.8874475,
      "lng": 107.5465521
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/0c2a629dd_Annisa-2026-02-21-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 34,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6998feda34d8c6a8cbcb8b64",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-21",
    "check_in_time": "07:39",
    "check_out_time": "15:40",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873645831121415,
      "lng": 107.54651490404798
    },
    "check_out_location": {
      "lat": -6.887364602818324,
      "lng": 107.5465185597787
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/7889451dc_Mawar-2026-02-21-07_39-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 25,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6998fe72e16c0f1201dc2932",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-21",
    "check_in_time": "07:38",
    "check_out_time": "16:26",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874961,
      "lng": 107.5465554
    },
    "check_out_location": {
      "lat": -6.8874701,
      "lng": 107.5465606
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/d58e718c6_Salma-2026-02-21-07_38-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 71,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6997b0c1454cb30179c7af22",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-20",
    "check_in_time": "07:54",
    "check_out_time": "18:49",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873908,
      "lng": 107.5464918
    },
    "check_out_location": {
      "lat": -6.8874613,
      "lng": 107.5465576
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/92588a48f_Desil-2026-02-20-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 94,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6997ae12b715578f8b3d37a3",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-20",
    "check_in_time": "07:42",
    "check_out_time": "18:45",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887364602818324,
      "lng": 107.5465185597787
    },
    "check_out_location": {
      "lat": -6.887364602818324,
      "lng": 107.5465185597787
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/af2b3954f_Mawar-2026-02-20-07_42-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 90,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6997af92445c380b9241aaee",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-20",
    "check_in_time": "07:49",
    "check_out_time": "18:50",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874265,
      "lng": 107.5465595
    },
    "check_out_location": {
      "lat": -6.8874405,
      "lng": 107.546549
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/d18910a03_Salma-2026-02-20-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 95,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6997b0ad28d4e908d7af4609",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-20",
    "check_in_time": "07:54",
    "check_out_time": "18:49",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874373,
      "lng": 107.5465576
    },
    "check_out_location": {
      "lat": -6.8874063,
      "lng": 107.5465565
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/9f3bac41e_Annisa-2026-02-20-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 94,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69965ed6f08e64015a696327",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-19",
    "check_in_time": "07:52",
    "check_out_time": "18:03",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887431,
      "lng": 107.5465619
    },
    "check_out_location": {
      "lat": -6.8874208,
      "lng": 107.5465259
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a94ed0a4c_Desil-2026-02-19-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 48,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69965e975f600bf1dc2557a9",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-19",
    "check_in_time": "07:51",
    "check_out_time": "18:02",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874272,
      "lng": 107.5465558
    },
    "check_out_location": {
      "lat": -6.8874278,
      "lng": 107.546554
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/58a847525_Salma-2026-02-19-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 47,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69965e59b8efcc77ece278ce",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-19",
    "check_in_time": "07:50",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887397,
      "lng": 107.5464534
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/005c09f28_Annisa-2026-02-19-07_50-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69965ab94c1f1ab47e18e8be",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-19",
    "check_in_time": "07:35",
    "check_out_time": "18:02",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8875100740972615,
      "lng": 107.54649276376654
    },
    "check_out_location": {
      "lat": -6.8873663798467994,
      "lng": 107.54651646246114
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/d7553eae2_Mawar-2026-02-19-07_35-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 47,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69950f44c1806f1522896813",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-18",
    "check_in_time": "08:00",
    "check_out_time": "18:07",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887427,
      "lng": 107.5465536
    },
    "check_out_location": {
      "lat": -6.8874975,
      "lng": 107.5465547
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/5b9836857_Salma-2026-02-18-08_00-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 52,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69950c31bc9b9f6c87fff958",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-18",
    "check_in_time": "07:47",
    "check_out_time": "18:04",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874509,
      "lng": 107.5465523
    },
    "check_out_location": {
      "lat": -6.8874198,
      "lng": 107.5465216
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/f6fc86cf6_Annisa-2026-02-18-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 49,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69950c063f6339640127bb7d",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-18",
    "check_in_time": "07:47",
    "check_out_time": "18:04",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874779,
      "lng": 107.5465639
    },
    "check_out_location": {
      "lat": -6.8874762,
      "lng": 107.5465606
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/d350e3509_Desil-2026-02-18-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 49,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6994fe51d84b2ddc008b8891",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-18",
    "check_in_time": "06:48",
    "check_out_time": "18:05",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873663798467994,
      "lng": 107.54651646246114
    },
    "check_out_location": {
      "lat": -6.8873830302535195,
      "lng": 107.54647444831413
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/8d34cb224_Mawar-2026-02-18-06_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 50,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6993aff570a2d7c271e36c5b",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-17",
    "check_in_time": "07:01",
    "check_out_time": "14:41",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887357789628315,
      "lng": 107.54652273530935
    },
    "check_out_location": {
      "lat": -6.8873663798467994,
      "lng": 107.54651646246114
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/58b7551c6_Mawar-2026-02-17-07_01-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 138
  },
  {
    "id": "6993bcc3069cb1957045f76e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-17",
    "check_in_time": "07:56",
    "check_out_time": "14:48",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873212,
      "lng": 107.5465527
    },
    "check_out_location": {
      "lat": -6.8873977,
      "lng": 107.5465537
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/dba627236_Annisa-2026-02-17-07_56-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 131
  },
  {
    "id": "6993bc79855a2ce8db51a777",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-17",
    "check_in_time": "07:55",
    "check_out_time": "14:42",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874893,
      "lng": 107.546556
    },
    "check_out_location": {
      "lat": -6.8874703,
      "lng": 107.5465575
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e774f837a_Salma-2026-02-17-07_55-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 137
  },
  {
    "id": "6993bbc4c70c120741b002a4",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-17",
    "check_in_time": "07:52",
    "check_out_time": "14:56",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874489,
      "lng": 107.546556
    },
    "check_out_location": {
      "lat": -6.8874381,
      "lng": 107.5465598
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/21505467c_Desil-2026-02-17-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 123
  },
  {
    "id": "699267b48ebfecc040842514",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-16",
    "check_in_time": "07:41",
    "check_out_time": "17:45",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873787,
      "lng": 107.5464905
    },
    "check_out_location": {
      "lat": -6.8874793,
      "lng": 107.5465559
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/ef34bf9ac_Annisa-2026-02-16-07_41-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 30,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "699269aa9e93bdace774afd5",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-16",
    "check_in_time": "07:49",
    "check_out_time": "17:48",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874849,
      "lng": 107.54656
    },
    "check_out_location": {
      "lat": -6.8874506,
      "lng": 107.5465588
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/66ce2c78f_Salma-2026-02-16-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 33,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6992694295e33f6833b20978",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-16",
    "check_in_time": "07:48",
    "check_out_time": "17:52",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874883,
      "lng": 107.5465545
    },
    "check_out_location": {
      "lat": -6.8874922,
      "lng": 107.5465639
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/4a8a7dd37_Desil-2026-02-16-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 37,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69925a923715768f09ff340e",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-16",
    "check_in_time": "06:45",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873663798467994,
      "lng": 107.54651646246114
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/49e0f36b2_Mawar-2026-02-16-06_45-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698fe87ec454b170a8f397e0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-14",
    "check_in_time": "10:14",
    "check_out_time": "15:27",
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874914,
      "lng": 107.5465592
    },
    "check_out_location": {
      "lat": -6.8874746,
      "lng": 107.5464811
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/0a13eefd8_Annisa-2026-02-14-10_14-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 12,
    "late_minutes": 134,
    "early_leave_minutes": 0
  },
  {
    "id": "698fc5635acac036a014b3c0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-14",
    "check_in_time": "07:44",
    "check_out_time": "15:22",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874885,
      "lng": 107.5465623
    },
    "check_out_location": {
      "lat": -6.8874993,
      "lng": 107.5465672
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/4f3467030_Desil-2026-02-14-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698fc53598757193f9913780",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-14",
    "check_in_time": "07:43",
    "check_out_time": "15:22",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874341,
      "lng": 107.5465576
    },
    "check_out_location": {
      "lat": -6.8874777,
      "lng": 107.5465588
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/b11e14025_Salma-2026-02-14-07_43-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a15b3027ccb1d94d95dcce",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-14",
    "check_in_time": null,
    "check_out_time": null,
    "status": "IZIN",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Sidang Akhir Prodi Desain Grafis Tahun 2026",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698e763fc32ed44d15f02d48",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-13",
    "check_in_time": "07:54",
    "check_out_time": "18:03",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874789,
      "lng": 107.5465596
    },
    "check_out_location": {
      "lat": -6.8875125,
      "lng": 107.5465494
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/52d5a897e_Annisa-2026-02-13-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 48,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698e761bf0305af909984703",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-13",
    "check_in_time": "07:53",
    "check_out_time": "19:00",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887371,
      "lng": 107.5463668
    },
    "check_out_location": {
      "lat": -6.887437,
      "lng": 107.5465601
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/d0621bd35_Salma-2026-02-13-07_53-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 105,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698e73d5eeb09960b4e13adc",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-13",
    "check_in_time": "07:44",
    "check_out_time": "18:46",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874822,
      "lng": 107.5465632
    },
    "check_out_location": {
      "lat": -6.887489,
      "lng": 107.54656
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/6914b310a_Desil-2026-02-13-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 91,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698e7099e822ef4b24f26558",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-13",
    "check_in_time": "07:30",
    "check_out_time": "12:08",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.88735802031717,
      "lng": 107.54651886173511
    },
    "check_out_location": {
      "lat": -6.88735802031717,
      "lng": 107.54651886173511
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/8692becf6_Mawar-2026-02-13-07_30-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 291
  },
  {
    "id": "698d25bb698dfa361dc4a9c9",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-12",
    "check_in_time": "07:58",
    "check_out_time": "17:24",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.88735802031717,
      "lng": 107.54651886173511
    },
    "check_out_location": {
      "lat": -6.88735802031717,
      "lng": 107.54651886173511
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/52c6da772_Mawar-2026-02-12-07_58-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 9,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698d24515b74d2e85288ffad",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-12",
    "check_in_time": "07:52",
    "check_out_time": "17:37",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874245,
      "lng": 107.5465535
    },
    "check_out_location": {
      "lat": -6.8873711,
      "lng": 107.5464081
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/18b6aeb2e_Salma-2026-02-12-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 22,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698d21ec7f786724ed8d8732",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-12",
    "check_in_time": "07:42",
    "check_out_time": "17:33",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887475,
      "lng": 107.5465629
    },
    "check_out_location": {
      "lat": -6.8874814,
      "lng": 107.5465676
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3167291ea_Desil-2026-02-12-07_42-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 18,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698d21a4fb9dcae1c6cab2b1",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-12",
    "check_in_time": "07:41",
    "check_out_time": "14:35",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874868,
      "lng": 107.5463068
    },
    "check_out_location": {
      "lat": -6.8874587,
      "lng": 107.5465539
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/4fc9b4829_Annisa-2026-02-12-07_41-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 144
  },
  {
    "id": "698bd2757ce354d679e86f2c",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-11",
    "check_in_time": "07:51",
    "check_out_time": "17:25",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874549,
      "lng": 107.5463235
    },
    "check_out_location": {
      "lat": -6.8874066,
      "lng": 107.5465538
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/fffb7b8dc_Annisa-2026-02-11-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 10,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698bd1b85030c1e305515798",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-11",
    "check_in_time": "07:47",
    "check_out_time": "17:22",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887453,
      "lng": 107.5465601
    },
    "check_out_location": {
      "lat": -6.8874938,
      "lng": 107.5465541
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/bd3aaec5b_Salma-2026-02-11-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698bd193f03727922c2dde72",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-11",
    "check_in_time": "07:47",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874809,
      "lng": 107.5465624
    },
    "check_out_location": {
      "lat": -6.887481,
      "lng": 107.5465556
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/f5eb4435e_Desil-2026-02-11-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698bd0db898ecd80308cd5ee",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-11",
    "check_in_time": "07:44",
    "check_out_time": "17:21",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887365564134921,
      "lng": 107.54651932769005
    },
    "check_out_location": {
      "lat": -6.887365564134921,
      "lng": 107.54651932769005
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/ae0724e6a_Mawar-2026-02-11-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 6,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698a7f4f87110689a4d7b2a0",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-10",
    "check_in_time": "07:43",
    "check_out_time": "17:25",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874735,
      "lng": 107.5465565
    },
    "check_out_location": {
      "lat": -6.8874006,
      "lng": 107.5465581
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a61cd6ec5_Annisa-2026-02-10-07_43-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 10,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698a7770d0c0c64378f014ee",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-10",
    "check_in_time": "07:10",
    "check_out_time": "17:23",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887370705507689,
      "lng": 107.54651577315275
    },
    "check_out_location": {
      "lat": -6.887370705507689,
      "lng": 107.54651577315275
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/2ac477dd1_Mawar-2026-02-10-07_10-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 8,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698a7ee7b3df03bbf5ace9aa",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-10",
    "check_in_time": "07:42",
    "check_out_time": "17:57",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874779,
      "lng": 107.5465662
    },
    "check_out_location": {
      "lat": -6.8874,
      "lng": 107.5465567
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/0b72fee4d_Desil-2026-02-10-07_42-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 42,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698a8328601dd97ec2cbbb0b",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-10",
    "check_in_time": "08:00",
    "check_out_time": "17:57",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874994,
      "lng": 107.5465666
    },
    "check_out_location": {
      "lat": -6.8874229,
      "lng": 107.5465473
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3fa488e83_Salma-2026-02-10-08_00-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 42,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6989b74fe74b8146b91a04e3",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-09",
    "check_in_time": "17:30",
    "check_out_time": "17:31",
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874876,
      "lng": 107.5465688
    },
    "check_out_location": {
      "lat": -6.8874274,
      "lng": 107.5465637
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/c0b9ea199_Salma-2026-02-09-17_30-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 16,
    "late_minutes": 570,
    "early_leave_minutes": 0
  },
  {
    "id": "69892ef207635462a4575588",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-09",
    "check_in_time": "07:48",
    "check_out_time": "17:33",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8873967,
      "lng": 107.5465575
    },
    "check_out_location": {
      "lat": -6.8874443,
      "lng": 107.5465592
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/36dfdd791_Desil-2026-02-09-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 18,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69892d34a20db83b654fd110",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-09",
    "check_in_time": "07:41",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874861,
      "lng": 107.5465642
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/bf342d81c_Annisa-2026-02-09-07_41-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69892cf47dea223c94136a7f",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-09",
    "check_in_time": "07:40",
    "check_out_time": "17:28",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887384433949144,
      "lng": 107.54650796759418
    },
    "check_out_location": {
      "lat": -6.887384433949144,
      "lng": 107.54650796759418
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e38549e0f_Mawar-2026-02-09-07_40-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 13,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a15b34d182ed25a2987026",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-06",
    "check_in_time": null,
    "check_out_time": null,
    "status": "IZIN_SEPARUH",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Kontrol Mamah ke Mitra Kasih",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6982979250593898c34b1a39",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-04",
    "check_in_time": "07:49",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887383359534955,
      "lng": 107.54650832668172
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/6c6e8b5a3_Mawar-2026-02-04-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6982967d6c217da1f7b05d63",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-04",
    "check_in_time": "07:44",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874685,
      "lng": 107.5465504
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/8d55b0712_Annisa-2026-02-04-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6981464fd4d7507ff53bfba8",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-03",
    "check_in_time": "07:50",
    "check_out_time": "18:21",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874869,
      "lng": 107.5465662
    },
    "check_out_location": {
      "lat": -6.8874688,
      "lng": 107.5465712
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/8fed5625f_Salma-2026-02-03-07_50-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 66,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698145c92645d9b7e23a860a",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-03",
    "check_in_time": "07:48",
    "check_out_time": "17:57",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887383359534955,
      "lng": 107.54650832668172
    },
    "check_out_location": {
      "lat": -6.887383359534955,
      "lng": 107.54650832668172
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/5de7e7b14_Mawar-2026-02-03-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 42,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69814596532f2870272d31eb",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-03",
    "check_in_time": "07:47",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874696,
      "lng": 107.5465618
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/1ab5b08f6_Desil-2026-02-03-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "698144f603e8389fa677c52b",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-03",
    "check_in_time": "07:44",
    "check_out_time": "17:40",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874358,
      "lng": 107.5465605
    },
    "check_out_location": {
      "lat": -6.8874872,
      "lng": 107.546325
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/0889d508f_Annisa-2026-02-03-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 25,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697fefcfd294aa1e646a9a74",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-02-02",
    "check_in_time": "07:29",
    "check_out_time": "17:33",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_out_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/03fb24bc0_Mawar-2026-02-02-07_29-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 18,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697ff5b07f64b38b4e6b1f02",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-02-02",
    "check_in_time": "07:54",
    "check_out_time": "17:49",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874559,
      "lng": 107.5465566
    },
    "check_out_location": {
      "lat": -6.8874589,
      "lng": 107.5465522
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e091181c0_Desil-2026-02-02-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 34,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697ff55744c3cfdfaa0799e9",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-02-02",
    "check_in_time": "07:52",
    "check_out_time": "17:47",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874793,
      "lng": 107.5465675
    },
    "check_out_location": {
      "lat": -6.8874809,
      "lng": 107.546568
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/bebc83d69_Salma-2026-02-02-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 32,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697ff4f6f9f78d60fb7a723e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-02-02",
    "check_in_time": "07:51",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874217,
      "lng": 107.5464442
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/6fc67a824_Annisa-2026-02-02-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697d51698c624ad703cf25e6",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-31",
    "check_in_time": "07:48",
    "check_out_time": "15:17",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887475,
      "lng": 107.5465606
    },
    "check_out_location": {
      "lat": -6.8874693,
      "lng": 107.5465583
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3213146bf_Desil-2026-01-31-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 2,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697d5102d4fd0c03bdbe875f",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-31",
    "check_in_time": "07:46",
    "check_out_time": "15:15",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874781,
      "lng": 107.5465465
    },
    "check_out_location": {
      "lat": -6.8874766,
      "lng": 107.5465535
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/f8d64afdb_Annisa-2026-01-31-07_46-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697d52ca7413b5f0d60bae97",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-31",
    "check_in_time": "07:54",
    "check_out_time": "15:18",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874281,
      "lng": 107.5465616
    },
    "check_out_location": {
      "lat": -6.8874722,
      "lng": 107.5465562
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/85061127d_Salma-2026-01-31-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 3,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697d52f6d24283f17088f58d",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-31",
    "check_in_time": "07:55",
    "check_out_time": "10:12",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_out_location": {
      "lat": -6.887382846018346,
      "lng": 107.54647330752147
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3b528b8a5_Mawar-2026-01-31-07_55-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 287
  },
  {
    "id": "697c028dda83fccb7a2fcb71",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-30",
    "check_in_time": "07:59",
    "check_out_time": "17:22",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_out_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/926e0d0ab_Mawar-2026-01-30-07_59-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 7,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697c0140561fb21c3589f051",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-30",
    "check_in_time": "07:54",
    "check_out_time": "17:46",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874365,
      "lng": 107.5465643
    },
    "check_out_location": {
      "lat": -6.8874005,
      "lng": 107.5465404
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a1275035c_Desil-2026-01-30-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 31,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697c009f150acaadfbabe322",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-30",
    "check_in_time": "07:51",
    "check_out_time": "17:47",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874594,
      "lng": 107.5465579
    },
    "check_out_location": {
      "lat": -6.8874791,
      "lng": 107.5465648
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/4047ae755_Salma-2026-01-30-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 32,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697bfffdbeef78de6b1783fb",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-30",
    "check_in_time": "07:49",
    "check_out_time": "17:46",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8875202,
      "lng": 107.546556
    },
    "check_out_location": {
      "lat": -6.8874005,
      "lng": 107.5464448
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/7c0063249_Annisa-2026-01-30-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 31,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697aafb74bd45722c2c15590",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-29",
    "check_in_time": "07:54",
    "check_out_time": "17:48",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8875121,
      "lng": 107.5465587
    },
    "check_out_location": {
      "lat": -6.8874833,
      "lng": 107.5463057
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/c2c0aeddc_Annisa-2026-01-29-07_54-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 33,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697aaf9cefce2fd286127d4a",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-29",
    "check_in_time": "07:53",
    "check_out_time": "17:47",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874714,
      "lng": 107.5465604
    },
    "check_out_location": {
      "lat": -6.8874576,
      "lng": 107.5465604
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/13d219a80_Salma-2026-01-29-07_53-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 32,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697aae392b9fa616c4a4e819",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-29",
    "check_in_time": "07:47",
    "check_out_time": "17:46",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887411,
      "lng": 107.5465192
    },
    "check_out_location": {
      "lat": -6.8874903,
      "lng": 107.5465618
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/3b89a7b04_Desil-2026-01-29-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 31,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697aa418f46732caadc1c394",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-29",
    "check_in_time": "07:04",
    "check_out_time": "17:44",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_out_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/be0b5065a_Mawar-2026-01-29-07_04-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 29,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69795db2f0643e620b6a00f2",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-28",
    "check_in_time": "07:52",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874337,
      "lng": 107.5464694
    },
    "check_out_location": {
      "lat": -6.8874062,
      "lng": 107.5465507
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/003da1630_Annisa-2026-01-28-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69795ce4e7db6c6ed345a759",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-28",
    "check_in_time": "07:48",
    "check_out_time": "17:11",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874756,
      "lng": 107.5465621
    },
    "check_out_location": {
      "lat": -6.8874872,
      "lng": 107.5465559
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e42437c25_Desil-2026-01-28-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69795b0b919681fb51b709f6",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-28",
    "check_in_time": "07:40",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874811,
      "lng": 107.546555
    },
    "check_out_location": {
      "lat": -6.8874915,
      "lng": 107.5465607
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/8c76f8816_Salma-2026-01-28-07_40-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697953a09beeb3b8136b1185",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-28",
    "check_in_time": "07:09",
    "check_out_time": "17:10",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887387830878953,
      "lng": 107.54650403417341
    },
    "check_out_location": {
      "lat": -6.887373850514629,
      "lng": 107.54652810243994
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/198e3686e_Mawar-2026-01-28-07_09-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6977fc8b41cc38ff7d933201",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-27",
    "check_in_time": "06:45",
    "check_out_time": "17:02",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887396592889531,
      "lng": 107.54650067354422
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/47056dbc5_Mawar-2026-01-27-06_45-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69780a70adf7b10c2b948745",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-27",
    "check_in_time": "07:44",
    "check_out_time": "17:06",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874263,
      "lng": 107.5465199
    },
    "check_out_location": {
      "lat": -6.8874259,
      "lng": 107.5463543
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/61df413ee_Annisa-2026-01-27-07_44-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69780b7e32e8080a66e42355",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-27",
    "check_in_time": "07:49",
    "check_out_time": "17:19",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874634,
      "lng": 107.546557
    },
    "check_out_location": {
      "lat": -6.8874814,
      "lng": 107.5465633
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/232dccbdd_Salma-2026-01-27-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 4,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69780b904dd90aebb8417196",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-27",
    "check_in_time": "07:49",
    "check_out_time": "17:09",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874783,
      "lng": 107.5465555
    },
    "check_out_location": {
      "lat": -6.8874858,
      "lng": 107.5465585
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/2a0ce31a0_Desil-2026-01-27-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6976bbfebd13c0f2c75259ef",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-26",
    "check_in_time": "07:57",
    "check_out_time": null,
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874815,
      "lng": 107.5465609
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/60878d6a6_Salma-2026-01-26-07_57-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6976bad9b454f8d80c5ffd12",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-26",
    "check_in_time": "07:52",
    "check_out_time": "17:18",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874185,
      "lng": 107.5465137
    },
    "check_out_location": {
      "lat": -6.8874754,
      "lng": 107.5465509
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/4500ee791_Desil-2026-01-26-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 3,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6976b9f58396be2538519cfc",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-26",
    "check_in_time": "07:48",
    "check_out_time": "17:12",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874854,
      "lng": 107.5465566
    },
    "check_out_location": {
      "lat": -6.8873635,
      "lng": 107.5465635
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/74a919516_Annisa-2026-01-26-07_48-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6976aed0f0fb97ded6b3f05b",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-26",
    "check_in_time": "07:01",
    "check_out_time": "17:11",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/51e574da6_Mawar-2026-01-26-07_01-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6974173509656e4005664e04",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-24",
    "check_in_time": "07:49",
    "check_out_time": "16:32",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874816,
      "lng": 107.5465639
    },
    "check_out_location": {
      "lat": -6.887458,
      "lng": 107.5465548
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/7da840725_Desil-2026-01-24-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 32,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6974172ff0dadbd87fae70b3",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-24",
    "check_in_time": "07:49",
    "check_out_time": "16:32",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874545,
      "lng": 107.5465569
    },
    "check_out_location": {
      "lat": -6.8874864,
      "lng": 107.5465527
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a5a709e6b_Salma-2026-01-24-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 77,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69741790374724f33e5a7af5",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-24",
    "check_in_time": "07:51",
    "check_out_time": "15:19",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8875025,
      "lng": 107.5465708
    },
    "check_out_location": {
      "lat": -6.8874376,
      "lng": 107.5465197
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a8c85ce16_Annisa-2026-01-24-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "697417db82149ad12667e0e8",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-24",
    "check_in_time": "07:52",
    "check_out_time": "10:25",
    "status": "PULANG_CEPAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/79e03390f_Mawar-2026-01-24-07_52-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 274
  },
  {
    "id": "6972c84855d3bd7629793974",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-23",
    "check_in_time": "08:00",
    "check_out_time": "18:12",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874292,
      "lng": 107.5465624
    },
    "check_out_location": {
      "lat": -6.8874321,
      "lng": 107.5465556
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e7cfde8d4_Salma-2026-01-23-08_00-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 57,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6972c67562a8c04585767443",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-23",
    "check_in_time": "07:53",
    "check_out_time": "17:14",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/1ddb2530b_Mawar-2026-01-23-07_53-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6972c600134759f9a37658dc",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-23",
    "check_in_time": "07:51",
    "check_out_time": "18:15",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874784,
      "lng": 107.5465598
    },
    "check_out_location": {
      "lat": -6.8874374,
      "lng": 107.5465578
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/e69edfe8d_Desil-2026-01-23-07_51-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 60,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6972c51f807141c0779b14bd",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-23",
    "check_in_time": "07:47",
    "check_out_time": "17:13",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874947,
      "lng": 107.5465639
    },
    "check_out_location": {
      "lat": -6.8874908,
      "lng": 107.546563
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/dbd9bfc9f_Annisa-2026-01-23-07_47-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6971733b5a35fd490d75f307",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-22",
    "check_in_time": "07:45",
    "check_out_time": "17:31",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874596,
      "lng": 107.5465623
    },
    "check_out_location": {
      "lat": -6.8874699,
      "lng": 107.5465624
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/40f5824a8_Salma-2026-01-22-07_45-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 16,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69731a057fb7f8cd751a3980",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-22",
    "check_in_time": null,
    "check_out_time": null,
    "status": "SAKIT",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Demam flu",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6971742e731e6a9d3dd86449",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-22",
    "check_in_time": "07:49",
    "check_out_time": "17:27",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874806,
      "lng": 107.546559
    },
    "check_out_location": {
      "lat": -6.8874836,
      "lng": 107.5465431
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/87ae9c2c7_Desil-2026-01-22-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 12,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6971740b8989abcd9272d708",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-22",
    "check_in_time": "07:49",
    "check_out_time": "17:25",
    "status": "HADIR",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/077508d19_Mawar-2026-01-22-07_49-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 10,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "6970a64ac4cf734096d1c2c7",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "date": "2026-01-21",
    "check_in_time": "17:11",
    "check_out_time": "17:11",
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874408,
      "lng": 107.5464903
    },
    "check_out_location": {
      "lat": -6.8874768,
      "lng": 107.5465619
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/f71142edc_Desil-2026-01-21-17_11-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 551,
    "early_leave_minutes": 0
  },
  {
    "id": "69705dd05e5ce028323bff58",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "date": "2026-01-21",
    "check_in_time": "12:02",
    "check_out_time": null,
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874356,
      "lng": 107.5465591
    },
    "check_out_location": null,
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/ad3008956_Salma-2026-01-21-12_02-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 242,
    "early_leave_minutes": 0
  },
  {
    "id": "6970a60653c4e8650cc2bef0",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "date": "2026-01-21",
    "check_in_time": "17:10",
    "check_out_time": "17:10",
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_out_location": {
      "lat": -6.887360903809927,
      "lng": 107.54650239349814
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/a5ac60dc7_Mawar-2026-01-21-17_10-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 550,
    "early_leave_minutes": 0
  },
  {
    "id": "6970a6cad12e8a91617e8674",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-21",
    "check_in_time": "17:13",
    "check_out_time": "17:13",
    "status": "TERLAMBAT",
    "check_in_method": "MANUAL",
    "check_in_location": {
      "lat": -6.8874146,
      "lng": 107.5465548
    },
    "check_out_location": {
      "lat": -6.8874084,
      "lng": 107.5465469
    },
    "check_in_photo_url": "https://base44.app/api/apps/69703e20455c76de15d60ffe/files/public/69703e20455c76de15d60ffe/1dcefea15_Annisa-2026-01-21-17_13-checkin.jpg",
    "notes": "",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 553,
    "early_leave_minutes": 0
  },
  {
    "id": "69a15b314a1ae73f2de3134e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-14",
    "check_in_time": null,
    "check_out_time": null,
    "status": "IZIN_SEPARUH",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Kontrol Papah ke Kasih Bunda",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  },
  {
    "id": "69a15b36ee88969c4d93130a",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "date": "2026-01-12",
    "check_in_time": null,
    "check_out_time": null,
    "status": "IZIN_SEPARUH",
    "check_in_method": "MANUAL",
    "check_in_location": null,
    "check_out_location": null,
    "check_in_photo_url": "",
    "notes": "Kontrol Papah ke Kasih Bunda",
    "is_auto_checkout": false,
    "overtime_minutes": 0,
    "late_minutes": 0,
    "early_leave_minutes": 0
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    "id": "6989b77b61ea78784f394ee9",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_03",
    "employee_name": "Mawar",
    "type": "CUTI",
    "start_date": "2026-02-14",
    "end_date": "2026-02-14",
    "reason": "Sidang Akhir Prodi Desain Grafis Tahun 2026",
    "status": "APPROVED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-02-09"
  },
  {
    "id": "6979d3957d12b95831abd560",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_02",
    "employee_name": "Annisa",
    "type": "CUTI",
    "start_date": "2026-01-14",
    "end_date": "2026-01-14",
    "reason": "Kontrol Papah ke Kasih Bunda",
    "status": "APPROVED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-01-28"
  },
  {
    "id": "6979d356128935e928cd1299",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_02",
    "employee_name": "Annisa",
    "type": "CUTI",
    "start_date": "2026-01-12",
    "end_date": "2026-01-12",
    "reason": "Kontrol Papah ke Kasih Bunda",
    "status": "APPROVED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-01-28"
  },
  {
    "id": "6979d302a28885e48752a19d",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_02",
    "employee_name": "Annisa",
    "type": "CUTI",
    "start_date": "2026-02-06",
    "end_date": "2026-02-06",
    "reason": "Kontrol Mamah ke Mitra Kasih",
    "status": "APPROVED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-01-28"
  },
  {
    "id": "697418e36ff6779b1c30e437",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_03",
    "employee_name": "Mawar",
    "type": "CUTI",
    "start_date": "2026-01-24",
    "end_date": "2026-01-24",
    "reason": "Izin untuk bimbingan ke kampus dan fokus mengerjakan skripsi, insyaallah jam kerja akan diganti setiap 1 jam lebih pagi dari hari Senin-Kamis.",
    "status": "REJECTED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-01-24"
  },
  {
    "id": "6971685d721307760ef2a94f",
    "company_id": "comp_elyasr",
    "employee_id": "emp_el_02",
    "employee_name": "Annisa",
    "type": "CUTI",
    "start_date": "2026-01-22",
    "end_date": "2026-01-22",
    "reason": "Demam flu",
    "status": "APPROVED",
    "approved_by": "asfizaneva@gmail.com",
    "created_at": "2026-01-21"
  }
];

export const overtimeRequests: OvertimeRequest[] = [];

export const corrections: AttendanceCorrection[] = [];

export const payrollRecords: PayrollRecord[] = [
  {
    "id": "69f45bee195e637f939ab75c",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "employee_name": "Salma",
    "employee_nik": "EL-EM-01",
    "period": "2026-04",
    "working_days": 26,
    "days_present": 25,
    "base_salary": 1300000,
    "transport": 250000,
    "uang_makan": 0,
    "overtime_pay": 50187.49999999999,
    "bonus": 275000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 1125000,
    "total_pay": 3000187.5,
    "status": "DRAFT",
    "generated_at": "2026-05-01T07:53:18.424000",
    "finalized_at": "2026-05-01T08:43:54.137000"
  },
  {
    "id": "69f45beef963eb8e675826cd",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "employee_name": "Annisa",
    "employee_nik": "EL-EM-02",
    "period": "2026-04",
    "working_days": 26,
    "days_present": 24,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-05-01T07:53:18.185000",
    "finalized_at": "2026-05-01T08:41:58.714000"
  },
  {
    "id": "69f45bedf901825460c41651",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "employee_name": "Mawar",
    "employee_nik": "EL-EM-03",
    "period": "2026-04",
    "working_days": 26,
    "days_present": 24,
    "base_salary": 1100000,
    "transport": 360000,
    "uang_makan": 0,
    "overtime_pay": 18243.600000000002,
    "bonus": 450000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 795000,
    "total_pay": 2723243.6,
    "status": "DRAFT",
    "generated_at": "2026-05-01T07:53:17.952000",
    "finalized_at": "2026-05-01T08:47:23.874000"
  },
  {
    "id": "69f45bedd2d901ef6b4fe5dc",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "employee_name": "Desil",
    "employee_nik": "EL-EM-04",
    "period": "2026-04",
    "working_days": 26,
    "days_present": 25,
    "base_salary": 1000000,
    "transport": 250000,
    "uang_makan": 0,
    "overtime_pay": 37422,
    "bonus": 200000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 1075000,
    "total_pay": 2562422,
    "status": "DRAFT",
    "generated_at": "2026-05-01T07:53:17.714000",
    "finalized_at": "2026-05-01T08:41:58.134000"
  },
  {
    "id": "69f45bed7a0677d21c41a0d6",
    "company_id": "comp_elyasr",
    "employee_id": "69cc9ba87030f27d5b9bd839",
    "employee_name": "Muhammad Rizky Maulana",
    "employee_nik": "OWN-1",
    "period": "2026-04",
    "working_days": 26,
    "days_present": 1,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-05-01T07:53:17.482000",
    "finalized_at": "2026-05-01T08:41:57.889000"
  },
  {
    "id": "69cf6f92fbcdb8a763a5fd02",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "employee_name": "Salma",
    "employee_nik": "EL-EM-01",
    "period": "2026-02",
    "working_days": 24,
    "days_present": 14,
    "base_salary": 1300000,
    "transport": 140000,
    "uang_makan": 0,
    "overtime_pay": 82381,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 565000,
    "total_pay": 2087381,
    "status": "DRAFT",
    "generated_at": "2026-04-03T07:43:14.810000",
    "finalized_at": "2026-04-03T07:43:14.810000"
  },
  {
    "id": "69cf6f92030d8e3c40ad670e",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "employee_name": "Annisa",
    "employee_nik": "EL-EM-02",
    "period": "2026-02",
    "working_days": 24,
    "days_present": 14,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-04-03T07:43:14.509000",
    "finalized_at": "2026-04-03T07:43:14.509000"
  },
  {
    "id": "69cf6f92d4dd17e24d5d5e2f",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "employee_name": "Mawar",
    "employee_nik": "EL-EM-03",
    "period": "2026-02",
    "working_days": 24,
    "days_present": 13,
    "base_salary": 1100000,
    "transport": 195000,
    "uang_makan": 0,
    "overtime_pay": 37716,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 465000,
    "total_pay": 1797716,
    "status": "DRAFT",
    "generated_at": "2026-04-03T07:43:14.207000",
    "finalized_at": "2026-04-03T07:43:14.207000"
  },
  {
    "id": "69cf6f91dd9471c9c18bde59",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "employee_name": "Desil",
    "employee_nik": "EL-EM-04",
    "period": "2026-02",
    "working_days": 24,
    "days_present": 14,
    "base_salary": 1000000,
    "transport": 140000,
    "uang_makan": 0,
    "overtime_pay": 56941,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 635000,
    "total_pay": 1831941,
    "status": "DRAFT",
    "generated_at": "2026-04-03T07:43:13.959000",
    "finalized_at": "2026-04-03T07:43:13.959000"
  },
  {
    "id": "69cf6f91996c2ac213ec2264",
    "company_id": "comp_elyasr",
    "employee_id": "69cc9ba87030f27d5b9bd839",
    "employee_name": "Muhammad Rizky Maulana",
    "employee_nik": "OWN-1",
    "period": "2026-02",
    "working_days": 24,
    "days_present": 0,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-04-03T07:43:13.668000",
    "finalized_at": "2026-04-03T07:50:34.248000"
  },
  {
    "id": "69cce3f05b2ff729fac9f2e3",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "employee_name": "Salma",
    "employee_nik": "EL-EM-01",
    "period": "2026-03",
    "working_days": 16,
    "days_present": 15,
    "base_salary": 1300000,
    "transport": 150000,
    "uang_makan": 0,
    "overtime_pay": 222721.08,
    "bonus": 1100000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 600000,
    "total_pay": 3372721.08,
    "status": "FINALIZED",
    "generated_at": "2026-04-01T09:22:56.010000",
    "finalized_at": "2026-04-02T03:02:26.192000"
  },
  {
    "id": "69cce3ef8b749e3d7d863b4a",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "employee_name": "Annisa",
    "employee_nik": "EL-EM-02",
    "period": "2026-03",
    "working_days": 16,
    "days_present": 16,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 3000000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 3000000,
    "status": "FINALIZED",
    "generated_at": "2026-04-01T09:22:55.708000",
    "finalized_at": "2026-04-02T03:02:26.546000"
  },
  {
    "id": "69cce3ef7da6a8b87ce5eac3",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "employee_name": "Mawar",
    "employee_nik": "EL-EM-03",
    "period": "2026-03",
    "working_days": 16,
    "days_present": 15,
    "base_salary": 1100000,
    "transport": 225000,
    "uang_makan": 0,
    "overtime_pay": 183052.2,
    "bonus": 800000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 525000,
    "total_pay": 2833052.2,
    "status": "FINALIZED",
    "generated_at": "2026-04-01T09:22:55.428000",
    "finalized_at": "2026-04-02T03:02:26.980000"
  },
  {
    "id": "69cce3eed749bfc625df37d8",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "employee_name": "Desil",
    "employee_nik": "EL-EM-04",
    "period": "2026-03",
    "working_days": 16,
    "days_present": 16,
    "base_salary": 1000000,
    "transport": 160000,
    "uang_makan": 0,
    "overtime_pay": 233764.96000000002,
    "bonus": 700000,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 715000,
    "total_pay": 2808764.96,
    "status": "FINALIZED",
    "generated_at": "2026-04-01T09:22:54.888000",
    "finalized_at": "2026-04-02T03:02:27.285000"
  },
  {
    "id": "69cce3eebc927d5f2a6cd390",
    "company_id": "comp_elyasr",
    "employee_id": "69cc9ba87030f27d5b9bd839",
    "employee_name": "Muhammad Rizky Maulana",
    "employee_nik": "OWN-1",
    "period": "2026-03",
    "working_days": 16,
    "days_present": 0,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "FINALIZED",
    "generated_at": "2026-04-01T09:22:54.525000",
    "finalized_at": "2026-04-02T03:02:27.572000"
  },
  {
    "id": "69731a23017a604811c1f44a",
    "company_id": "comp_elyasr",
    "employee_id": "69703ee3cdb0341809bba875",
    "employee_name": "Asfi Zaneva",
    "employee_nik": "EMP001",
    "period": "2026-01",
    "working_days": 22,
    "days_present": 0,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-01-23T06:50:11.835000",
    "finalized_at": "2026-01-23T06:50:11.835000"
  },
  {
    "id": "697069beafdf00d25357291d",
    "company_id": "comp_elyasr",
    "employee_id": "69705c978aaecd6d1b6098dd",
    "employee_name": "Salma",
    "employee_nik": "EL-EM-01",
    "period": "2026-01",
    "working_days": 22,
    "days_present": 3,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-01-21T05:53:02.410000",
    "finalized_at": "2026-01-23T06:50:11.495000"
  },
  {
    "id": "697069be3901b3b6fba69b89",
    "company_id": "comp_elyasr",
    "employee_id": "69705cb9c87c315049a3d86a",
    "employee_name": "Annisa",
    "employee_nik": "EL-EM-02",
    "period": "2026-01",
    "working_days": 22,
    "days_present": 2,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-01-21T05:53:02.072000",
    "finalized_at": "2026-01-23T06:50:11.233000"
  },
  {
    "id": "697069bdf7d4b0c4530c2e17",
    "company_id": "comp_elyasr",
    "employee_id": "69705ccf821338a5238bf548",
    "employee_name": "Mawar",
    "employee_nik": "EL-EM-03",
    "period": "2026-01",
    "working_days": 22,
    "days_present": 3,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-01-21T05:53:01.727000",
    "finalized_at": "2026-01-23T06:50:10.984000"
  },
  {
    "id": "697069bd7a6666629669c71b",
    "company_id": "comp_elyasr",
    "employee_id": "69705cec51ca2bef9c5ccdd7",
    "employee_name": "Desil",
    "employee_nik": "EL-EM-04",
    "period": "2026-01",
    "working_days": 22,
    "days_present": 3,
    "base_salary": 0,
    "transport": 0,
    "uang_makan": 0,
    "overtime_pay": 0,
    "bonus": 0,
    "deductions": 0,
    "late_deductions": 0,
    "absence_deductions": 0,
    "allowances": 0,
    "total_pay": 0,
    "status": "DRAFT",
    "generated_at": "2026-01-21T05:53:01.464000",
    "finalized_at": "2026-01-23T06:50:10.730000"
  }
];

export const notifications: Notification[] = [];

export const holidays: Holiday[] = [
  {
    "id": "69f46a36aa550f801499b19d",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Natal",
    "date": "2026-12-26",
    "is_national": true
  },
  {
    "id": "69f4693796908143741aca09",
    "company_id": "comp_elyasr",
    "name": "Hari Natal",
    "date": "2026-12-25",
    "is_national": true
  },
  {
    "id": "69f4693796908143741aca0a",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Natal",
    "date": "2026-12-24",
    "is_national": true
  },
  {
    "id": "69f4693796908143741aca08",
    "company_id": "comp_elyasr",
    "name": "Maulid Nabi Muhammad SAW",
    "date": "2026-09-15",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca07",
    "company_id": "comp_elyasr",
    "name": "Hari Kemerdekaan RI",
    "date": "2026-08-17",
    "is_national": true
  },
  {
    "id": "69f4693796908143741aca06",
    "company_id": "comp_elyasr",
    "name": "Tahun Baru Islam 1448H",
    "date": "2026-07-07",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca05",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Idul Adha",
    "date": "2026-06-18",
    "is_national": true
  },
  {
    "id": "69f4693796908143741aca04",
    "company_id": "comp_elyasr",
    "name": "Idul Adha",
    "date": "2026-06-17",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca03",
    "company_id": "comp_elyasr",
    "name": "Hari Lahir Pancasila",
    "date": "2026-06-01",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b19b",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Waisak",
    "date": "2026-05-25",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca02",
    "company_id": "comp_elyasr",
    "name": "Hari Raya Waisak",
    "date": "2026-05-23",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca01",
    "company_id": "comp_elyasr",
    "name": "Kenaikan Isa Almasih",
    "date": "2026-05-14",
    "is_national": false
  },
  {
    "id": "69f4693796908143741aca00",
    "company_id": "comp_elyasr",
    "name": "Hari Buruh",
    "date": "2026-05-01",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b19a",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Idul Fitri",
    "date": "2026-04-14",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b199",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Idul Fitri",
    "date": "2026-04-13",
    "is_national": false
  },
  {
    "id": "69f46903e03d56c6ee009f9f",
    "company_id": "comp_elyasr",
    "name": "Idul Fitri 2",
    "date": "2026-04-11",
    "is_national": false
  },
  {
    "id": "69f46903182f29220d732f90",
    "company_id": "comp_elyasr",
    "name": "Idul Fitri 1",
    "date": "2026-04-10",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b198",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Idul Fitri",
    "date": "2026-04-09",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b197",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Idul Fitri",
    "date": "2026-04-08",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe61b",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-29",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe61a",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-28",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe619",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-27",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe618",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-26",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe617",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-25",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe616",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-24",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe615",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-23",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe614",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-22",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe613",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-21",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe612",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-20",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe611",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-19",
    "is_national": false
  },
  {
    "id": "69cce3cc05bf2ee1d95fe610",
    "company_id": "comp_elyasr",
    "name": "Libur Lebaran",
    "date": "2026-03-18",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b196",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Isra Miraj",
    "date": "2026-02-09",
    "is_national": false
  },
  {
    "id": "69f46902a23e635516e8b1f9",
    "company_id": "comp_elyasr",
    "name": "Isra Miraj",
    "date": "2026-02-08",
    "is_national": false
  },
  {
    "id": "69f46a36aa550f801499b195",
    "company_id": "comp_elyasr",
    "name": "Cuti Bersama Tahun Baru",
    "date": "2026-01-02",
    "is_national": true
  }
];

export const locations: Location[] = [
  {
    "id": "69705a074077f3efae83ed22",
    "company_id": "comp_elyasr",
    "name": "KONVEKSI",
    "address": "Jl. Sadang Sari No.53, Margahayu Tengah, Kec. Margahayu, Kabupaten Bandung, Jawa Barat 40218",
    "lat": -6.961805979962827,
    "lng": 107.56871570000001,
    "radius_meters": 75
  },
  {
    "id": "69704f2abe376740733ae915",
    "company_id": "comp_elyasr",
    "name": "Kantor Pusat",
    "address": "Kp Sukamaju no 15 Cigugur Tengah Kota Cimahi",
    "lat": -6.887259844765239,
    "lng": 107.54658055311016,
    "radius_meters": 75
  }
];

export const demoAccounts = [
  {
    "email": "rizkyzaneva@gmail.com",
    "password": "admin123",
    "label": "Owner (Super Admin)"
  },
  {
    "email": "asfizaneva@gmail.com",
    "password": "admin123",
    "label": "Admin ELYASR"
  },
  {
    "email": "financeelyasr@gmail.com",
    "password": "admin123",
    "label": "Karyawan - Salma"
  },
  {
    "email": "creativeelyasrnew@gmail.com",
    "password": "admin123",
    "label": "Karyawan - Mawar"
  },
  {
    "email": "cselyasrsukses@gmail.com",
    "password": "admin123",
    "label": "Karyawan - Desil"
  },
  {
    "email": "annisanurafifahh@gmail.com",
    "password": "admin123",
    "label": "Karyawan - Annisa"
  },
  {
    "email": "yasrikhaira1@gmail.com",
    "password": "admin123",
    "label": "Admin - Yasri Khaira"
  }
];
