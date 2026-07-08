import React from "react";
import { Select } from "antd";
const { Option } = Select;

const StoreSelector = React.memo(({ storeContext }) => {
    const { isSuperAdmin, selectedStoreId, changeStore, stores, loadingStores } = storeContext;

    if (!isSuperAdmin) return null;

    return (
        <Select
            showSearch
            placeholder="Select Store..."
            loading={loadingStores}
            className="w-48 custom-selectbox selectbox-rounded-none"
            value={selectedStoreId || undefined}
            onChange={changeStore}
            filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
            }
        >
            {stores.map((store) => (
                <Option key={store._id} value={store._id} label={store.name}>
                    <span className="text-xs font-medium capitalize">{store.name}</span>
                </Option>
            ))}
        </Select>
    );
});

StoreSelector.displayName = "StoreSelector";

export default StoreSelector;
