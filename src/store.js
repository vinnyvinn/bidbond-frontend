import Vue from 'vue'
import Vuex from 'vuex'
import { AuthUser } from "./store/auth_user"
import { CounterParties } from "./store/counter_parties"
import { PostalCodes } from "./store/postal_codes"
import { RelationshipManagers } from "./store/relationship_managers";
import { Groups } from "./store/groups"
import { Company } from "./store/company"
import { Dashboard } from "./store/reports/dashboard"
import { Quotes } from "@/store/reports/quotes";
import {CompaniesReport} from "@/store/reports/companies";
import {Parts} from "@/store/paths";
import { BibondsReport } from "@/store/reports/bidbonds";
import { editBidbond } from "@/store/bidbonds";
import { Report} from "./store/report";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		AuthUser,
		CounterParties,
		PostalCodes,
		Groups,
		Company,
		Dashboard,
		Report,
		Quotes,
		CompaniesReport,
		Parts,
		BibondsReport,
		RelationshipManagers,
		editBidbond
	},

	state: {

	},

	mutations: {

	},

	actions: {

	}
})
