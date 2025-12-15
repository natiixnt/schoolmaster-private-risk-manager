'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type ClassItem = {
  id: string;
  name: string;
  yearLevel?: number;
};

type StudentItem = {
  id: string;
  firstName: string;
  lastName: string;
  externalId?: string;
};

type RiskStudent = {
  studentId: string;
  firstName: string;
  lastName: string;
  class?: { id: string; name: string };
  score: number;
  level: string;
  indicators: { name: string; value: unknown; level: string }[];
};

type ImportResult = {
  totalRows: number;
  createdStudents: number;
  createdClasses: number;
  errors: { rowNumber: number; message: string }[];
};

export default function DevToolsPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken');
    const storedRefresh = localStorage.getItem('refreshToken');
    setAccessToken(storedAccess);
    setRefreshToken(storedRefresh);
  }, []);

  const authedFetch = async (path: string, options?: RequestInit) => {
    if (!accessToken) {
      throw new Error('No access token. Please login first.');
    }
    const res = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed (${res.status})`);
    }
    return res.json();
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authedFetch('/classes');
      setClasses(data);
      setStudents([]);
      setSelectedClass(null);
    } catch (err: any) {
      setError(err?.message ?? 'Error loading classes');
    } finally {
      setLoading(false);
    }
  };

  const loadRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authedFetch('/risk/students');
      setRiskStudents(data);
    } catch (err: any) {
      setError(err?.message ?? 'Error loading risk students');
    } finally {
      setLoading(false);
    }
  };

  const recalcRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authedFetch('/risk/recalculate', { method: 'POST' });
      setError(`Recalculated: ${data.processed} students`);
      await loadRisk();
    } catch (err: any) {
      setError(err?.message ?? 'Error recalculating risk');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authedFetch(`/classes/${classId}/students`);
      setStudents(data);
      setSelectedClass(classId);
    } catch (err: any) {
      setError(err?.message ?? 'Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const uploadCsv = async (file: File | null) => {
    if (!file) {
      setError('Select a CSV first');
      return;
    }
    if (!accessToken) {
      setError('No access token. Login first.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${apiUrl}/import/students`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Upload failed');
      }
      const data = (await res.json()) as ImportResult;
      setImportResult(data);
    } catch (err: any) {
      setError(err?.message ?? 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>
        Tokens: access {accessToken ? 'loaded' : 'missing'} / refresh{' '}
        {refreshToken ? 'loaded' : 'missing'} |{' '}
        {!accessToken && <a href="/auth/login">Go to login</a>}
      </p>
      {!accessToken && <p>Not logged in. Please <a href="/auth/login">login</a> to use tools.</p>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <section>
        <h2>Upload students CSV</h2>
        <p>Columns: class_name, first_name, last_name, external_id (optional)</p>
        <input type="file" accept=".csv" onChange={(e) => uploadCsv(e.target.files?.[0] ?? null)} />
        {importResult && <pre>{JSON.stringify(importResult, null, 2)}</pre>}
      </section>

      <section>
        <h2>Classes & students</h2>
        <button onClick={loadClasses} disabled={loading || !accessToken}>
          Load classes
        </button>
        {classes.length > 0 && (
          <ul>
            {classes.map((cls) => (
              <li key={cls.id}>
                <button onClick={() => loadStudents(cls.id)} disabled={loading || !accessToken}>
                  {cls.name} {cls.yearLevel ? `(Year ${cls.yearLevel})` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedClass && (
          <div>
            <h3>Students for class</h3>
            <pre>{JSON.stringify(students, null, 2)}</pre>
          </div>
        )}
      </section>

      <section>
        <h2>Risk (dev)</h2>
        <button onClick={loadRisk} disabled={loading || !accessToken}>
          Load risk students
        </button>{' '}
        <button onClick={recalcRisk} disabled={loading || !accessToken}>
          Recalculate risk
        </button>
        {riskStudents.length > 0 && <pre>{JSON.stringify(riskStudents, null, 2)}</pre>}
      </section>
    </div>
  );
}
