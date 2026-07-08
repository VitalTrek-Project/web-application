import {EmergencyContact} from "./emergency-contact.entity.js";

/**
 * A tourist's personal, travel and health profile. Medical fields and emergency contacts
 * are sensitive — only ever loaded from a detail endpoint, never a list.
 *
 * @class TouristProfile
 */
export class TouristProfile {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.userId
     * @param {string} params.fullName
     * @param {string|null} [params.photoUrl]
     * @param {string|null} [params.dateOfBirth]
     * @param {string|null} [params.nationality]
     * @param {string|null} [params.phoneNumber]
     * @param {string|null} [params.preferredLanguage]
     * @param {string} params.experienceLevel
     * @param {string|null} [params.identityDocumentType]
     * @param {string|null} [params.identityDocumentNumber]
     * @param {string|null} [params.bloodType]
     * @param {string|null} [params.allergies]
     * @param {string|null} [params.medicalConditions]
     * @param {string|null} [params.medications]
     * @param {Array<Object>} [params.emergencyContacts]
     */
    constructor({
        id, userId, fullName, photoUrl = null, dateOfBirth = null, nationality = null, phoneNumber = null,
        preferredLanguage = null, experienceLevel, identityDocumentType = null, identityDocumentNumber = null,
        bloodType = null, allergies = null, medicalConditions = null, medications = null, emergencyContacts = []
    }) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.photoUrl = photoUrl;
        this.dateOfBirth = dateOfBirth;
        this.nationality = nationality;
        this.phoneNumber = phoneNumber;
        this.preferredLanguage = preferredLanguage;
        this.experienceLevel = experienceLevel;
        this.identityDocumentType = identityDocumentType;
        this.identityDocumentNumber = identityDocumentNumber;
        this.bloodType = bloodType;
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
        this.medications = medications;
        this.emergencyContacts = emergencyContacts.map(c => new EmergencyContact(c));
    }
}
