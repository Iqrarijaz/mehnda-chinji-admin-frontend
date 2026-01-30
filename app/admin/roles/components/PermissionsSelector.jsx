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
        <div className="flex flex-col gap-4">
            {permissionsMap && Object.entries(permissionsMap).map(([moduleKey, modulePerms]) => {
                const moduleValues = Object.values(modulePerms);
                const allChecked = moduleValues.every(p => selectedPermissions.includes(p));
                const intermediate = moduleValues.some(p => selectedPermissions.includes(p)) && !allChecked;

                return (
                    <Card
                        key={moduleKey}
                        size="small"
                        title={
                            <Checkbox
                                checked={allChecked}
                                indeterminate={intermediate}
                                onChange={(e) => handleModuleCheck(moduleKey, e.target.checked)}
                            >
                                {moduleKey}
                            </Checkbox>
                        }
                    >
                        <Row gutter={[16, 8]}>
                            {Object.entries(modulePerms).map(([actionKey, permissionValue]) => (
                                <Col span={8} key={permissionValue}>
                                    <Checkbox
                                        checked={selectedPermissions.includes(permissionValue)}
                                        onChange={(e) => handlePermissionCheck(permissionValue, e.target.checked)}
                                    >
                                        {actionKey}
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
