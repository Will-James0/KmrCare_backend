import { motion } from 'motion/react';
/* eslint-disable no-undef */
const UsersManagement = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Users Table - Responsive avec scroll horizontal */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'name', label: 'Nom', mobile: true },
                      { key: 'email', label: 'Email', mobile: false },
                      { key: 'role', label: 'Rôle', mobile: true },
                      { key: 'lastLogin', label: 'Dernière Connexion', mobile: false },
                      { key: 'phone', label: 'Téléphone', mobile: false },
                      { key: 'actions', label: 'Actions', mobile: true }
                    ].map((header) => (
                      <th
                        key={header.key}
                        className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          !header.mobile ? 'hidden md:table-cell' : ''
                        }`}
                        style={{
                          fontFamily: 'var(--caption-font-family)',
                          fontSize: '11px',
                          fontWeight: 'var(--caption-font-weight)'
                        }}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10425d] rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 text-xs sm:text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none" style={{
                            fontFamily: 'var(--body-font-family)',
                            fontSize: 'clamp(12px, 2.5vw, var(--body-font-size))'
                          }}>
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell" style={{
                        fontFamily: 'var(--body-font-family)',
                        fontSize: 'var(--body-font-size)'
                      }}>
                        {user.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          <span className="hidden sm:inline">{user.role}</span>
                          <span className="sm:hidden">
                            {user.role === 'Médecin' ? 'Dr' : user.role === 'Infirmière' ? 'Inf' : 'Pat'}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell" style={{
                        fontFamily: 'var(--body-font-family)',
                        fontSize: 'var(--body-font-size)'
                      }}>
                        {user.lastLogin}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell" style={{
                        fontFamily: 'var(--body-font-family)',
                        fontSize: 'var(--body-font-size)'
                      }}>
                        {user.phone}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-[#37A936] hover:text-[#2d8f2c] font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Modifier</span>
                            <span className="sm:hidden">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Supprimer</span>
                            <span className="sm:hidden">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>            {filteredUsers.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base" style={{
                  fontFamily: 'var(--body-font-family)',
                  fontSize: 'var(--body-font-size)'
                }}>
                  Aucun utilisateur trouvé.
                </p>
              </div>
            )}
    </div>
  );
};
export default UsersManagement;