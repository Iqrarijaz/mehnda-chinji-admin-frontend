"use client";
import { Card, Checkbox, Row, Col, Spin } from "antd";
import { PERMISSIONS } from "@/config/permissions";

const PermissionsSelector = ({ selectedPermissions = [], onChange }) => {
    // const { data: permissionsResponse, isLoading } = useQuery("permissionsList", GET_PERMISSIONS);
    const permissionsMap = PERMISSIONS;
    const isLoading = false;

    // Convert permissions map to array format for rendering if needed, 
    // but map iteration key-value is fine.

    const handleModuleCheck = (moduleKey, checked) => {
        const modulePermissions = Object.values(permissionsMap[moduleKey]);
        let newSelected = [...selectedPermissions];

        if (checked) {
            // Add all permissions for this module
            const unique = new Set([...newSelected, ...modulePermissions]);
            newSelected = Array.from(unique);
        } else {
            // Remove all permissions for this module
            newSelected = newSelected.filter(p => !modulePermissions.includes(p));
        }
        onChange(newSelected);
    };

    const handlePermissionCheck = (permission, checked) => {
        let newSelected = [...selectedPermissions];
        if (checked) {
            if (!newSelected.includes(permission)) newSelected.push(permission);
        } else {
            newSelected = newSelected.filter(p => p !== permission);
        }
        onChange(newSelected);
    };

    if (isLoading) return <Spin />;

    return (
        <div className="flex flex-col gap-3">
            {permissionsMap && Object.entries(permissionsMap).map(([moduleKey, modulePerms]) => {
                const moduleValues = Object.values(modulePerms);
                const allChecked = moduleValues.every(p => selectedPermissions.includes(p));
                const intermediate = moduleValues.some(p => selectedPermissions.includes(p)) && !allChecked;

                return (
                    <Card
                        key={moduleKey}
                        size="small"
                        className="!rounded border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden shadow-sm transition-colors duration-300"
                        title={
                            <div className="flex items-center justify-between">
                                <Checkbox
                                    checked={allChecked}
                                    indeterminate={intermediate}
                                    onChange={(e) => handleModuleCheck(moduleKey, e.target.checked)}
                                    className="!text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 custom-teal-checkbox"
                                >
                                    {moduleKey}
                                </Checkbox>
                                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                                    {moduleValues.filter(p => selectedPermissions.includes(p)).length} / {moduleValues.length}
                                </span>
                            </div>
                        }
                        headStyle={{ backgroundColor: 'var(--bg-secondary)', padding: '0 12px', minHeight: '32px', borderBottom: '1px solid var(--border-color)' }}
                        bodyStyle={{ padding: '8px 12px', backgroundColor: 'transparent' }}
                    >
                        <Row gutter={[12, 6]}>
                            {Object.entries(modulePerms).map(([actionKey, permissionValue]) => (
                                <Col span={12} md={8} key={permissionValue}>
                                    <Checkbox
                                        checked={selectedPermissions.includes(permissionValue)}
                                        onChange={(e) => handlePermissionCheck(permissionValue, e.target.checked)}
                                        className="!text-[10px] text-slate-600 dark:text-slate-400 font-medium capitalize custom-teal-checkbox transition-colors duration-300"
                                    >
                                        {actionKey.toLowerCase()}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                );
            })}
        </div>
    );
};

export default PermissionsSelector;
