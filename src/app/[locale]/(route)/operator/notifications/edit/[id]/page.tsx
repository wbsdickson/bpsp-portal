import React from "react";

import NotificationUpsertForm from "../../_components/notification-upsert-form";

const EditNotificationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <NotificationUpsertForm mode="edit" notificationId={id} />;
};

export default EditNotificationPage;
