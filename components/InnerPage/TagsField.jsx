import React, { useEffect, useRef, useState } from "react";
import { Flex, Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Field, useFormikContext } from "formik";

const tagInputStyle = {
  width: 64,
  height: 22,
  marginInlineEnd: 10,
  verticalAlign: "top",
};

function TagsFields({ label = "Fields", name }) {
  const { values, setFieldValue } = useFormikContext();
  const tags = values[name] || [];
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue)) {
      const newTags = [...tags, inputValue.trim()];
      setFieldValue(name, newTags);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setFieldValue(name, newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setFieldValue(name, newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputIndex]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission by Enter key
      if (inputVisible) {
        handleInputConfirm();
      } else if (editInputIndex !== -1) {
        handleEditInputConfirm();
      }
    }
  };

  const tagPlusStyle = {
    height: 22,
    background: "#f0f2f5", // Replace with actual token or color variable
    borderStyle: "dashed",
  };

  return (
    <div className="mb-3">
      <div className="grid">
        <label className="text-black font-[500] mb-1" htmlFor={name}>
          {label}
        </label>
        <Flex gap="4px 0 flex flex-col gap-6" wrap>
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Field
                  key={tag}
                  name={`${name}.${index}`}
                  className="custom-tag-input mb-2"
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleKeyPress} // Handle Enter key for confirming edit
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true} // Always show the closable icon
                onClose={() => handleClose(tag)}
                style={{ userSelect: "none" }}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      setEditInputIndex(index);
                      setEditInputValue(tag);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible ? (
            <Field
              innerRef={inputRef}
              type="text"
              name="newTag"
              className="custom-tag-input focus:outline-none border-2 border-lightBlue"
              style={tagInputStyle}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleKeyPress} // Handle Enter key for adding new tag
            />
          ) : (
            <Tag
              style={tagPlusStyle}
              icon={<PlusOutlined />}
              onClick={showInput}
            >
              New variable
            </Tag>
          )}
        </Flex>
      </div>
    </div>
  );
}

export default TagsFields;
