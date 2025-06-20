import { SignUpResponse ,SignUpRequest} from './sign-up.response';

export class SignUpAssembler {
  static fromRequest(request: SignUpRequest): SignUpRequest {
    return {
      ruc: request.ruc,
      legalName: request.legalName,
      commercialName: request.commercialName,
      address: request.address,
      city: request.city,
      country: request.country,
      tenantPhone: request.tenantPhone,
      tenantEmail: request.tenantEmail,
      website: request.website || '',
      username: request.username,
      password: request.password,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName
    };
  }

  static fromResponse(response: SignUpResponse): SignUpResponse {
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      company: {
        ruc: response.company.ruc,
        legalName: response.company.legalName,
        commercialName: response.company.commercialName,
        address: response.company.address,
        city: response.company.city,
        country: response.company.country,
        tenantPhone: response.company.tenantPhone,
        tenantEmail: response.company.tenantEmail,
        website: response.company.website
      },
      created_at: response.created_at,
      updated_at: response.updated_at,
      message: response.message,
      success: response.success
    };
  }
}
