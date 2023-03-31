import { login } from "./login";

const USER_NAME = "bye";
const USER_EMAIL = "bye@noroff.no";
const USER_PASSWORD = "heiheihei";
const USER_INVALID_PASSWORD = "987654321";
const USER_CRED = { name: USER_NAME, email: USER_EMAIL };
const USER_TESTER = JSON.stringify({
  email: USER_EMAIL,
  password: USER_PASSWORD,
});
const USER_TOKEN = "Invalid Token";

class LocalStorageMock {
  constructor() {
    this.value = {};
  }

  clear() {
    this.value = {};
  }

  getItem(key) {
    return this.value[key] || null;
  }

  setItem(key, value) {
    this.value[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

function validLogin() {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(USER_CRED),
  });
}

function invalidLogin() {
  return Promise.resolve({
    ok: false,
    status: 404,
    statusText: "Not Authorized",
  });
}

describe("Login Test", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockClear();
  });

  it("stores a token in local storage when credentials are valid", async () => {
    global.fetch.mockResolvedValue(validLogin());
    await login(USER_TESTER);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      JSON.stringify(USER_TOKEN)
    );
    expect(localStorage.getItem("token")).toEqual(JSON.stringify(USER_TOKEN));
  });

  it("throws an error if login is invalid", async () => {
    global.fetch.mockResolvedValue(invalidLogin());
    await expect(
      login(
        JSON.stringify({ email: USER_EMAIL, password: USER_INVALID_PASSWORD })
      )
    ).rejects.toThrow("Not valid login");
  });
});
