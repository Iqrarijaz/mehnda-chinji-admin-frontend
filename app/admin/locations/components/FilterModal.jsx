import { Modal, Input } from "antd";
import { FaSearch, FaFilter, FaUndo, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

function FilterModal({ isModalOpen, setIsModalOpen, setFilters }) {
  const [localFilters, setLocalFilters] = useState({
    name: "",
    type: null,
    status: null,
  });

  useEffect(() => {
    if (isModalOpen) {
      setLocalFilters({
        name: "",
        type: null,
        status: null,
      });
    }
  }, [isModalOpen]);

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      advance: {
        name: localFilters.name?.trim() || null,
        type: localFilters.type || null,
        status: localFilters.status || null,
      },
      currentPage: 1,
    }));
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({ name: "", type: null, status: null });
    setFilters((prev) => ({
      ...prev,
      advance: null,
      currentPage: 1,
    }));
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      centered
      width={480}
      title={
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
            <FaFilter size={14} />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block">Location Filters</span>
            <span className="text-xs text-slate-500 font-normal">Refine the geography listing</span>
          </div>
        </div>
      }
      className="modern-modal"
    >
      <div className="flex flex-col gap-4 p-1 mt-4">
        {/* Name Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Location Name</label>
          <Input
            placeholder="Search by name..."
            value={localFilters.name}
            onChange={(e) => setLocalFilters((prev) => ({ ...prev, name: e.target.value }))}
            prefix={<FaSearch className="text-slate-300 mr-2" />}
            allowClear
            className="!h-[36px] !rounded-lg !text-xs !border-slate-100 focus:!border-[#006666]"
          />
        </div>

        {/* Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Level</label>
          <SelectBox
            placeholder="All Levels"
            allowClear
            value={localFilters.type}
            handleChange={(value) => setLocalFilters((prev) => ({ ...prev, type: value }))}
            options={[
              { value: "VILLAGE", label: "Village" },
              { value: "TEHSIL", label: "Tehsil" },
              { value: "DISTRICT", label: "District" }
            ]}
            className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
          />
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Status</label>
          <SelectBox
            placeholder="Any Status"
            allowClear
            value={localFilters.status}
            handleChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value }))}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive / Disabled" }
            ]}
            className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
          <CustomButton
            label="Reset"
            type="secondary"
            onClick={handleReset}
            icon={<FaUndo size={11} />}
            className="flex-1"
          />
          <CustomButton
            label="Apply Filters"
            onClick={handleApply}
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
}

export default FilterModal;
