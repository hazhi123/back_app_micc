// import {
//   BusinessSystemModulesEntity,
// } from '../entities/business-system-modules.entity';

// export const createModulesForBusiness = async (repository, data) => {
//   await repository.createQueryBuilder()
//     .insert()
//     .into(BusinessSystemModulesEntity)
//     .values([
//       { business: data.businessId, systemModules: 1, status: true },
//       { business: data.businessId, systemModules: 2, status: true },
//       { business: data.businessId, systemModules: 3, status: true },
//       { business: data.businessId, systemModules: 4, status: true },
//       { business: data.businessId, systemModules: 5, status: true },
//       { business: data.businessId, systemModules: 6, status: true },
//       { business: data.businessId, systemModules: 7, status: true },
//       { business: data.businessId, systemModules: 8, status: true },
//       { business: data.businessId, systemModules: 9, status: true },
//       { business: data.businessId, systemModules: 10, status: true },
//       { business: data.businessId, systemModules: 11, status: true },
//       { business: data.businessId, systemModules: 12, status: true },
//       { business: data.businessId, systemModules: 15, status: true },
//     ])
//     .execute();
// }