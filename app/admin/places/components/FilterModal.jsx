import SearchInput from "@/components/InnerPage/SearchInput";
import SelectBox from "@/components/SelectBox";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import { PLACE_CATEGORIES } from "@/config/config";
import { FaFilter } from "react-icons/fa";

function FilterModal({ open, onCancel, filters, setFilters, handleCategoryFilter }) {
    const handleReset = () => {
        setFilters((prev) => ({
            ...prev,
            search: "",
            category: undefined,
            page: 1
        }));
        if (onCancel) onCancel();
    };

    const activeCount = [
        filters.search,
        filters.category
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Filter Places"
            icon={<FaFilter size={14} />}
            open={open}
            onCancel={onCancel}
            onApply={onCancel}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="space-y-1 px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Places</label>
                <SearchInput
                    setFilters={setFilters}
                    className="w-full !h-[32px] !text-xs !rounded"
                    placeholder="Search..."
                />
            </div>

            <div className="space-y-1 px-1 mt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <SelectBox
                    placeholder="All Categories"
                    allowClear
                    handleChange={handleCategoryFilter}
                    width="100%"
                    options={PLACE_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
                    className="modern-select-box"
                    value={filters.category}
                />
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
