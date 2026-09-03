import React from "react";

function WecomAvatar({ item, size = 44, unread = 0 }) {
  return (
    <div className="wecom-avatar-wrap" style={{ width: size, height: size }}>
      <div
        className={item.type === "group" ? "wecom-avatar-img group" : "wecom-avatar-img"}
        style={{
          "--avatar-a": item.avatarColors?.[0] || "#8fc7ff",
          "--avatar-b": item.avatarColors?.[1] || "#1b63d9",
          fontSize: Math.max(14, Math.round(size * 0.36))
        }}
      >
        {item.avatarImage ? <img src={item.avatarImage} alt="" /> : item.avatar}
      </div>
      {unread ? <span className="unread-badge">{unread}</span> : null}
    </div>
  );
}

export default WecomAvatar;
