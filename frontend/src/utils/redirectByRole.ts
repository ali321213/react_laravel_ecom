// frontend\src\utils\redirectByRole.ts
export const redirectByRole = (role: string) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "customer":
      return "/";
    default:
      return "/";
  }
};
