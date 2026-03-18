"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import Input from "@/components/common/InputField";
import Label from "@/components/common/Label";
import DisabledButton from "../common/DisabledButton";
import OutlinedButton from "../common/OutlinedButton";
import PrimaryButton from "../common/PrimaryButton";
import Skeleton from "../common/Skeleton";
import { Team } from "@/types/models";
import { createTeam, fetchTeams } from "../../lib/actions/teamActions";
import TeamsEditList from "./TeamsEditList";
import Select, { SelectOption } from "../common/Select";

const competitionOptions: SelectOption[] = [
  { label: "NB I", value: "NB_I" },
  { label: "Extra Liga", value: "EXTRA_LIGA" },
  { label: "International", value: "INTERNATIONAL" },
];
const kindOptions: SelectOption[] = [
  { label: "Klub", value: "club" },
  { label: "Ország", value: "country" },
];

const TeamsEdit = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [editModeOpen, setEditModeOpen] = useState<boolean>(false);
	const [edited, setEdited] = useState<boolean>(false);
	const [teamName, setTeamName] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [teamLeader, setTeamLeader] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [kind, setKind] = useState<Team["kind"]>("club");
	const [competition, setCompetition] = useState<SelectOption | undefined>(undefined);
	const [countryCode, setCountryCode] = useState<string>("");
	const [teamList, setTeamList] = useState<Team[]>([]);

	const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setEdited(true);
		}
		setTeamName(e.target.value);
	};

	const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setEdited(true);
		}
		setCity(e.target.value);
	};

	const handleTeamLeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setEdited(true);
		}
		setTeamLeader(e.target.value);
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setEdited(true);
		}
		setPhone(e.target.value);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setEdited(true);
		}
		setEmail(e.target.value);
	};

	const handleKindChange = (o?: SelectOption) => {
		setEdited(true);
		setKind((o?.value as Team["kind"]) || "club");
	};

	const handleCompetitionChange = (o: SelectOption | undefined) => {
		setEdited(true);
		setCompetition(o);
	};

	const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEdited(true);
		setCountryCode(e.target.value);
	};

	const resetToDefault = useCallback(() => {
		setEdited(false);
		setTeamName("");
		setCity("");
		setTeamLeader("");
		setPhone("");
		setEmail("");
		setKind("club");
		setCompetition(undefined);
		setCountryCode("");
	}, []);

	const toggleEditMode = () => {
		setEditModeOpen(!editModeOpen);
		resetToDefault();
	};

	const toggleCreateNew = useCallback(() => {
		setEditModeOpen(!editModeOpen);
		resetToDefault();
	}, [editModeOpen, resetToDefault]);

	const handleSave = useCallback(async () => {
		if (!teamName.trim()) {
			toast.error("A csapat név megadása kötelező.");
			return;
		}
		try {
			setLoading(true);
			const res = await createTeam({
				name: teamName,
				city,
				teamLeader,
				phone,
				email,
				kind,
				competitions: competition
					? ([competition.value] as Team["competitions"])
					: ([] as Team["competitions"]),
				aliases: [],
				countryCode: countryCode || undefined,
			});
			const success = res instanceof Error ? false : res.success;
			if (!success) {
				throw new Error("Hiba történt a mentés során.");
			}
			if (success) {
				toast.success("Sikeres mentés");
				resetToDefault();
				toggleCreateNew();
				getTeams();
			}

		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Ismeretlen hiba történt.");
		} finally {
			setLoading(false);
		}
	}, [
		teamName,
		city,
		teamLeader,
		phone,
		email,
		kind,
		competition,
		countryCode,
		toggleCreateNew,
		resetToDefault,
	]);


	const getTeams = async () => {
		try {
			setLoading(true);
			const result = await fetchTeams();
			if (!result.success) return null;
			setTeamList(result.data);
			return result.data;
		} catch (error) {
			console.error(error);
			return new Error(error instanceof Error ? error.message : String(error));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getTeams();
	}, []);


	if (loading)
		return (
			<>
				{Array.from({ length: 10 }).map((_, i) => (
					<Skeleton
						key={i}
						className="w-full h-12 mb-2"
					/>
				))}
			</>
		);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
			<div className="flex flex-col mb-5">
				<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
					<button
						onClick={toggleEditMode}
						className="flex w-full items-center justify-center gap-2 rounded-full border mb-4 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
					>
						<Icon icon="lucide:plus" width="20" height="20" />
						{editModeOpen ? "Mégsem" : "Új csapat feltöltése"}
					</button>
				</div>
				{editModeOpen && (
					<>
						<div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
							<div className="col-span-2 lg:col-span-1">
								<Label htmlFor="teamName">Csapat név:</Label>
								<Input
									type="text"
									id="teamName"
									defaultValue={""}
									onChange={handleTeamNameChange}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label htmlFor="city">Város:</Label>
								<Input
									type="text"
									id="city"
									defaultValue={""}
									onChange={handleCityChange}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label htmlFor="teamLeader">Csapatvezető:</Label>
								<Input
									type="text"
									id="teamLeader"
									defaultValue={""}
									onChange={handleTeamLeaderChange}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label htmlFor="phone">Telefonszám:</Label>
								<Input
									type="text"
									id="phone"
									defaultValue={""}
									onChange={handlePhoneChange}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label htmlFor="email">Email:</Label>
								<Input
									type="text"
									id="email"
									defaultValue={""}
									onChange={handleEmailChange}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label>Típus:</Label>
								<Select
									options={kindOptions.map((o) => ({ ...o, name: "kind" }))}
									placeholder="--Típus--"
									onChange={handleKindChange}
									value={{
										value: kind,
										label: kindOptions.find((k) => k.value === kind)?.label,
									} as SelectOption}
								/>
							</div>
							<div className="col-span-2 lg:col-span-1">
								<Label>Versenyek:</Label>
								<Select
									options={competitionOptions.map((o) => ({ ...o, name: "competitions" }))}
									placeholder="--Versenyek--"
									onChange={handleCompetitionChange}
									value={competition}
								/>
							</div>
							{kind === "country" && (
								<div className="col-span-2 lg:col-span-1">
									<Label htmlFor="countryCode">Országkód (pl. HU):</Label>
									<Input
										type="text"
										id="countryCode"
										defaultValue={""}
										onChange={handleCountryCodeChange}
									/>
								</div>
							)}
						</div>
						<div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
							<div className="px-4 py-3 text-center sm:px-6">
								<OutlinedButton
									text={"Mégse"}
									type={"button"}
									onClick={toggleCreateNew}
								/>
							</div>
							<div className="px-4 py-3 text-center sm:px-6">
								{edited ? (
									<PrimaryButton onClick={handleSave} text="Mentés" />
								) : (
									<DisabledButton text={"Mentés"} />
								)}
							</div>
						</div>
					</>
				)}
			</div>
			{loading ? (
				<>
					{Array.from({ length: 10 }).map((_, i) => (
						<Skeleton key={i} className="w-full h-18 mb-2" />
					))}
				</>
			) : (
				<TeamsEditList teamList={teamList} loadTeamsAction={getTeams} />
			)}
		</div>

	)
};

export default TeamsEdit;