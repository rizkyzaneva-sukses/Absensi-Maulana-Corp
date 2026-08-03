import fs from 'node:fs';

const t = fs.readFileSync('src/lib/mock-data.ts', 'utf8');
const start = t.indexOf('export const employees');
const end = t.indexOf('export const teams');
const empSection = t.slice(start, end);
const employees = [];
const blocks = empSection.split(/\n\s*\{\n/).slice(1);
for (const block of blocks) {
  const id = block.match(/"id":\s*"([^"]+)"/)?.[1];
  const company = block.match(/"company_id":\s*"([^"]+)"/)?.[1];
  const name = block.match(/"full_name":\s*"([^"]*)"/)?.[1];
  const active = /"is_active":\s*true/.test(block);
  if (id) employees.push({ id, company_id: company, full_name: name, is_active: active });
}

// Also collect unique employee_ids from attendance history
const attStart = t.indexOf('export const attendanceRecords');
const attEnd = t.indexOf('export const leaveRequests');
const attSection = t.slice(attStart, attEnd);
const attEmpIds = [...new Set([...attSection.matchAll(/"employee_id":\s*"([^"]+)"/g)].map((m) => m[1]))];

console.log(JSON.stringify({
  employeeCount: employees.length,
  employees,
  attendanceEmployeeIds: attEmpIds,
  attendanceEmployeeCount: attEmpIds.length,
}, null, 2));
