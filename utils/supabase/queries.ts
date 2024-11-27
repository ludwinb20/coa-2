import { createClient } from './client';
const supabase = createClient();

export async function fetchDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*');

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }

  return data;
}

export async function fetchRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*');

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }

  return data;
}

export async function fetchCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return data;
}

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data;
} 