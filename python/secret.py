import random
import string

def get_secret(N):
    '''
    Creates a random secret

    param int N: Length of secret
    returns: Random secret with ascii letters and digits
    rtype: str
    '''
    return ''.join(random.choices(string.ascii_letters + string.digits, k=N))