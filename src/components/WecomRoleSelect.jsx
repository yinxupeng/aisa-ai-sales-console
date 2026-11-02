import React from "react";
import { Select } from "antd";
import { managedWecomAccounts } from "../data/appData";
import { buildWecomRoleOptions } from "../data/wecomRoleScope";

export default function WecomRoleSelect({ value = "all", onChange, ...props }) {
  return <Select aria-label="企微角色" showSearch optionFilterProp="label" value={value} onChange={onChange} options={buildWecomRoleOptions(managedWecomAccounts)} {...props} />;
}
