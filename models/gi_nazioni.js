import { Sequelize, DataTypes, Model } from 'sequelize';

export default class gi_nazioni extends Model {
    static initialize(sequelize) {
        gi_nazioni.init({
                sigla_nazione : {
                    primaryKey: true, 
                    type:  DataTypes.STRING(6),
                    field: 'sigla_nazione'
                },
                codice_belfiore : { 
                    type:  DataTypes.STRING(8),
                    field: 'codice_belfiore'
                },
                denominazione_nazione : { 
                    type:  DataTypes.STRING(100),
                    field: 'denominazione_nazione'
                },
                denominazione_cittadinanza : { 
                    type:  DataTypes.STRING(100),
                    field: 'denominazione_cittadinanza'
                },
        },
            {
                sequelize: sequelize,
                freezeTableName: true,
                tableName: 'gi_nazioni',
                timestamps: false,  // disable automatic timestamps
            }
        )
    }
}