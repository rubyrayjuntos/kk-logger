/**
 * Bulk Operations - Mass updates for user management
 */

import React, { useState } from 'react';
import {
  Download,
  Upload,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import type { Manager, UserRole, School } from '../../../shared/types/core';

interface BulkOperationsProps {
  selectedUsers: Manager[];
  onClose: () => void;
  onComplete: (operation: string, results: BulkOperationResult) => void;
}

interface BulkOperationResult {
  success: boolean;
  processed: number;
  errors: Array<{
    userId: string;
    error: string;
  }>;
  summary: string;
}

interface ImportRow {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  schoolCode: string;
  phoneNumber: string;
  language: 'en' | 'es';
  isActive: boolean;
  errors?: string[];
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedUsers,
  onClose,
  onComplete
}) => {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<BulkOperationResult | null>(null);

  // Export users to CSV
  const handleExportUsers = () => {
    setActiveOperation('export');
    setProcessing(true);

    // Create CSV content
    const headers = [
      'First Name',
      'Last Name', 
      'Email',
      'Role',
      'School Code',
      'Phone',
      'Language',
      'Status',
      'Last Login',
      'Training Complete'
    ];

    const csvData = selectedUsers.map(user => [
      user.firstName,
      user.lastName,
      user.email,
      user.role,
      user.schoolCode,
      user.phoneNumber || '',
      user.language,
      user.isActive ? 'Active' : 'Inactive',
      user.lastLoginDate || 'Never',
      user.requiredTrainingComplete ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `haccp-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setProcessing(false);
    
    const result: BulkOperationResult = {
      success: true,
      processed: selectedUsers.length,
      errors: [],
      summary: `Exported ${selectedUsers.length} users to CSV`
    };
    
    setResults(result);
  };

  // Import users from CSV
  const handleImportUsers = async (file: File) => {
    setActiveOperation('import');
    setProcessing(true);
    setImportProgress(0);

    try {
      const content = await file.text();
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const dataLines = lines.slice(1);
      
      const importRows: ImportRow[] = [];
      const errors: Array<{ userId: string; error: string }> = [];

      // Parse each row
      for (let i = 0; i < dataLines.length; i++) {
        const values = dataLines[i].split(',').map(v => v.replace(/"/g, '').trim());
        
        if (values.length < 6) {
          errors.push({
            userId: `Row ${i + 2}`,
            error: 'Insufficient columns - expected at least 6'
          });
          continue;
        }

        const row: ImportRow = {
          firstName: values[0] || '',
          lastName: values[1] || '',
          email: values[2] || '',
          role: (values[3] as UserRole) || 'manager',
          schoolCode: values[4] || '',
          phoneNumber: values[5] || '',
          language: (values[6] as 'en' | 'es') || 'en',
          isActive: values[7]?.toLowerCase() !== 'false',
          errors: []
        };

        // Validate row data
        if (!row.firstName) row.errors?.push('First name is required');
        if (!row.lastName) row.errors?.push('Last name is required');
        if (!row.email || !/\S+@\S+\.\S+/.test(row.email)) {
          row.errors?.push('Valid email is required');
        }
        if (!['manager', 'lead', 'admin'].includes(row.role)) {
          row.errors?.push('Role must be manager, lead, or admin');
        }
        if (!row.schoolCode) row.errors?.push('School code is required');

        importRows.push(row);
        
        // Update progress
        setImportProgress(((i + 1) / dataLines.length) * 50);
      }

      setImportData(importRows);
      
      // Process valid rows
      let processed = 0;
      const validRows = importRows.filter(row => !row.errors?.length);
      
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
          
          // Mock user creation
          console.log('Creating user:', row);
          processed++;
          
        } catch (error) {
          errors.push({
            userId: row.email,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        
        // Update progress
        setImportProgress(50 + ((i + 1) / validRows.length) * 50);
      }

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed,
        errors,
        summary: `Processed ${processed} users, ${errors.length} errors`
      };
      
      setResults(result);
      
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [{
          userId: 'File',
          error: error instanceof Error ? error.message : 'Failed to process file'
        }],
        summary: 'Import failed'
      };
      
      setResults(result);
    } finally {
      setProcessing(false);
    }
  };

  // Bulk role change
  const handleBulkRoleChange = async (newRole: UserRole) => {
    setActiveOperation('role_change');
    setProcessing(true);

    const errors: Array<{ userId: string; error: string }> = [];
    let processed = 0;

    for (const user of selectedUsers) {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Mock role update
        console.log(`Changing role for ${user.email} to ${newRole}`);
        processed++;
        
      } catch (error) {
        errors.push({
          userId: user.email,
          error: error instanceof Error ? error.message : 'Failed to update role'
        });
      }
    }

    const result: BulkOperationResult = {
      success: errors.length === 0,
      processed,
      errors,
      summary: `Updated ${processed} users to ${newRole} role`
    };
    
    setResults(result);
    setProcessing(false);
  };

  // Bulk deactivation
  const handleBulkDeactivation = async () => {
    setActiveOperation('deactivate');
    setProcessing(true);

    const errors: Array<{ userId: string; error: string }> = [];
    let processed = 0;

    for (const user of selectedUsers) {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Mock deactivation
        console.log(`Deactivating ${user.email}`);
        processed++;
        
      } catch (error) {
        errors.push({
          userId: user.email,
          error: error instanceof Error ? error.message : 'Failed to deactivate'
        });
      }
    }

    const result: BulkOperationResult = {
      success: errors.length === 0,
      processed,
      errors,
      summary: `Deactivated ${processed} users`
    };
    
    setResults(result);
    setProcessing(false);
  };

  // Bulk training assignment
  const handleBulkTrainingAssignment = async (trainingModules: string[]) => {
    setActiveOperation('assign_training');
    setProcessing(true);

    const errors: Array<{ userId: string; error: string }> = [];
    let processed = 0;

    for (const user of selectedUsers) {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Mock training assignment
        console.log(`Assigning training to ${user.email}:`, trainingModules);
        processed++;
        
      } catch (error) {
        errors.push({
          userId: user.email,
          error: error instanceof Error ? error.message : 'Failed to assign training'
        });
      }
    }

    const result: BulkOperationResult = {
      success: errors.length === 0,
      processed,
      errors,
      summary: `Assigned training to ${processed} users`
    };
    
    setResults(result);
    setProcessing(false);
  };

  const downloadTemplate = () => {
    const template = [
      'First Name,Last Name,Email,Role,School Code,Phone Number,Language,Active',
      'John,Smith,john.smith@school.edu,manager,SCH001,555-0123,en,true',
      'Maria,Garcia,maria.garcia@school.edu,lead,SCH001,555-0124,es,true'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'haccp-users-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (results && !processing) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Operation Complete</h2>
              <button
                onClick={() => {
                  setResults(null);
                  setActiveOperation(null);
                  onComplete(activeOperation || '', results);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
              results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {results.success ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${results.success ? 'text-green-900' : 'text-red-900'}`}>
                  {results.summary}
                </p>
                <p className={`text-sm ${results.success ? 'text-green-700' : 'text-red-700'}`}>
                  {results.processed} processed, {results.errors.length} errors
                </p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-slate-900">Errors:</h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {results.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                      <span className="font-medium">{error.userId}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => {
                  setResults(null);
                  setActiveOperation(null);
                  onComplete(activeOperation || '', results);
                }}
                variant="primary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Processing {activeOperation?.replace('_', ' ')}...
            </h3>
            {activeOperation === 'import' && (
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            )}
            <p className="text-slate-600">Please wait while we process your request</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Bulk Operations</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-600 mt-1">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Export Section */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Export Users</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Download selected users as CSV for external use or backup
            </p>
            <Button
              onClick={handleExportUsers}
              variant="outline"
              className="w-full"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to CSV
            </Button>
          </div>

          {/* Import Section */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Import Users</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Upload CSV file to create multiple users at once
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
              >
                <FileText className="w-4 h-4" />
                Download Template
              </Button>
              
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportUsers(file);
                  }
                }}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Role Change Section */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Change Roles</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Update user roles for all selected users
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleBulkRoleChange('manager')}
                variant="outline"
                size="sm"
              >
                Set as Manager
              </Button>
              <Button
                onClick={() => handleBulkRoleChange('lead')}
                variant="outline"
                size="sm"
              >
                Set as Lead
              </Button>
              <Button
                onClick={() => handleBulkRoleChange('admin')}
                variant="outline"
                size="sm"
              >
                Set as Admin
              </Button>
            </div>
          </div>

          {/* Training Assignment */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Assign Training</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Assign training modules to selected users
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={() => handleBulkTrainingAssignment(['haccp_fundamentals', 'temperature_logging'])}
                variant="outline"
                className="w-full"
              >
                Assign Basic Training Package
              </Button>
              <Button
                onClick={() => handleBulkTrainingAssignment(['advanced_haccp', 'corrective_actions'])}
                variant="outline"
                className="w-full"
              >
                Assign Advanced Training Package
              </Button>
            </div>
          </div>

          {/* Deactivation Section */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Deactivate Users</h3>
            </div>
            <p className="text-red-700 text-sm mb-4">
              Deactivate selected users - they will lose access immediately
            </p>
            <Button
              onClick={handleBulkDeactivation}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-100"
            >
              Deactivate Selected Users
            </Button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};